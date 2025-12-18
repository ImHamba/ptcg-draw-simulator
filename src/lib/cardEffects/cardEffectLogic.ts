import { cardNameFilter } from '../cardFilters'
import { cardListHasCard, decrementCardByCondition } from '../handDeckUtils'
import type { DrawState, EffectCard, TargetHands } from '../types'
import { nonSupporterEffectCards } from './nonSupporterCardEffects'
import { supporterEffectCards } from './supporterCardEffect'

/**
 * Plays the next effect card that can be played from hand.
 * If no effect card can be played, returns null.
 */
export const playNextEffectCard = (
  drawState: DrawState,
  effectCardList: EffectCard[],
  targetHands: TargetHands,
) => {
  // find the next effect card (prioritised by earliest in list) that can be played
  const nextCardToPlay = effectCardList.find(
    (effectCard) =>
      // hand must have the card
      cardListHasCard(drawState.hand, cardNameFilter(effectCard.name)) &&
      // the card must meet its play condition
      effectCard.playCondition(drawState, targetHands),
  )

  if (!nextCardToPlay) {
    // represents that no more cards can be played
    return null
  }

  return decrementInHandThenExecuteEffect(
    drawState,
    targetHands,
    nextCardToPlay,
  )
}

/**
 * Recursively plays all effect cards in the given list that can be played from hand.
 */
export const playEffectCards = (
  drawState: DrawState,
  effectCardList: EffectCard[],
  targetHands: TargetHands,
): DrawState => {
  const resultDrawState = playNextEffectCard(
    drawState,
    effectCardList,
    targetHands,
  )

  if (resultDrawState === null) {
    // base case: no more cards can be played
    return drawState
  }

  // recursive case: play the next effect card
  return playEffectCards(resultDrawState, effectCardList, targetHands)
}

/**
 * Plays all trainer cards (supporter and non-supporter cards) that can be played from hand.
 * Non-supporter cards are played first, then supporter cards, then non-supporter cards again.
 */
export const playTrainerEffectCards = (
  drawState: DrawState,
  targetHands: TargetHands,
) => {
  // play non supporter cards first
  const resultAfterNonSupporters = playEffectCards(
    drawState,
    nonSupporterEffectCards,
    targetHands,
  )

  // then supporter cards
  const resultAfterSupporters = playEffectCards(
    resultAfterNonSupporters,
    supporterEffectCards,
    targetHands,
  )

  // then non supporter cards again (some may be drawn after supporter effects)
  const resultAfterNonSupportersAgain = playEffectCards(
    resultAfterSupporters,
    nonSupporterEffectCards,
    targetHands,
  )

  return resultAfterNonSupportersAgain
}

/**
 * helper to decrement the effect card from hand before running its effect
 */
export const decrementInHandThenExecuteEffect = (
  drawState: DrawState,
  targetHands: TargetHands,
  effectCardDef: EffectCard,
) => {
  const effectCardFilter = cardNameFilter(effectCardDef.name)
  const effectCard = drawState.hand.find(effectCardFilter)

  if (!effectCard) {
    return drawState
  }

  const handAfterDecrement = decrementCardByCondition(
    drawState.hand,
    effectCardFilter,
  )

  return effectCardDef.playEffect(
    {
      hand: handAfterDecrement,
      deck: drawState.deck,
    },
    targetHands,
  )
}

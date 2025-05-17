import { pokeballFilter, profResearchFilter } from './cardFilters'
import {
  decrementCardByCondition,
  drawBasic,
  drawMany,
  sumCardCount,
} from './handDeckUtils'
import type { MultiPokeCard } from './types'

export const usePokeball = (hand: MultiPokeCard[], deck: MultiPokeCard[]) => {
  const pokeball = hand.find(pokeballFilter)

  if (!pokeball) {
    return { newHand: hand, newDeck: deck }
  }

  const handAfterDecrement = decrementCardByCondition(hand, pokeballFilter)

  const drawResult = drawBasic(handAfterDecrement, deck)
  return drawResult
}

export const useProfessorsResearch = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
) => {
  const research = hand.find(profResearchFilter)

  if (!research) {
    return { newHand: hand, newDeck: deck }
  }

  const handAfterDecrement = decrementCardByCondition(hand, profResearchFilter)

  // draw up to 2 cards if there are enough in deck
  const drawResult = drawMany(
    handAfterDecrement,
    deck,
    Math.min(2, sumCardCount(deck)),
  )

  return drawResult
}

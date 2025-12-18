import {
  cardNameFilter,
  createIsEquivalentCardFilter,
  lisiaFilter,
  megaEvolutionExPokemonFilter,
  pokemonFilter,
  toolFilter,
} from '../cardFilters'
import { CARD_NAMES } from '../constants'

import {
  addCardToCardList,
  cardListHasCard,
  drawByFilter,
  drawMany,
  returnHandToDeck,
  sumCardCount,
  targetHandsHaveCard,
} from '../handDeckUtils'
import type {
  CardFilter,
  DrawState,
  EffectCard,
  SearchEffectCardDef,
  TargetHands,
} from '../types'
import { and, not } from '../utils'

const handHasNoTargetCardsCondition = (
  drawState: DrawState,
  targetHands: TargetHands,
) =>
  !drawState.hand.some((pokeCard) =>
    targetHandsHaveCard(targetHands, createIsEquivalentCardFilter(pokeCard)),
  )

const mayCondition = (
  drawState: DrawState,
  targetHands: TargetHands,
): boolean => {
  // we want to use may if there is at least one target pokemon in deck
  // and at least one non-target pokemon in hand which we could swap to increase
  // the chances of ending up with more target cards than we started with
  const deckHasTargetPokemonCard = drawState.deck.some(
    (pokeCard) =>
      pokemonFilter(pokeCard) &&
      targetHandsHaveCard(targetHands, createIsEquivalentCardFilter(pokeCard)),
  )

  const handHasNonTargetPokemonCard = drawState.hand.some(
    (pokeCard) =>
      pokemonFilter(pokeCard) &&
      targetHandsHaveCard(
        targetHands,
        not(createIsEquivalentCardFilter(pokeCard)),
      ),
  )

  return deckHasTargetPokemonCard && handHasNonTargetPokemonCard
}

const professorsResearchEffect = (drawState: DrawState) =>
  drawMany(drawState, 2).drawState

const travelingMerchantEffect = (drawState: DrawState): DrawState => {
  const dummyDrawState = {
    hand: [],
    deck: drawState.deck,
  }

  // draw top 4 cards of deck
  const { drawState: drawStateAfterDraw, drawnCards } = drawMany(
    dummyDrawState,
    4,
  )

  // add tools from those 4 into hand
  return drawnCards.reduce(
    (drawState, card) => {
      // if tool, add to hand
      if (toolFilter(card)) {
        const newHand = addCardToCardList(card, drawState.hand, card.count)
        return {
          hand: newHand,
          deck: drawState.deck,
        }
      }

      // otherwise return back to deck
      const newDeck = addCardToCardList(card, drawState.deck, card.count)
      return {
        hand: drawState.hand,
        deck: newDeck,
      }
    },
    // start with the original hand and the deck after drawing, with the drawn cards to be added to one or the other
    // to total back up to the original count
    {
      hand: drawState.hand,
      deck: drawStateAfterDraw.deck,
    },
  )
}

const ionoEffect = (drawState: DrawState) => {
  const cardsInHand = sumCardCount(drawState.hand)

  // add all cards from hand back to deck
  const deckAfterReturn = returnHandToDeck(drawState)

  // draw same number of cards back
  return drawMany(deckAfterReturn, cardsInHand).drawState
}

const mayEffect = (drawState: DrawState, targetHands: TargetHands) => {
  // draw up to two pokemon
  const drawResult = drawMany(drawState, 2, pokemonFilter)
  const numberDrawn = sumCardCount(drawResult.drawnCards)

  const targetCardFilter: CardFilter = (card) =>
    targetHandsHaveCard(targetHands, createIsEquivalentCardFilter(card))

  // send cards from hand to deck that are non targets up to the number originally drawn
  const { drawState: drawStateAfterReturning, drawnCards: cardsReturned } =
    drawMany(
      drawResult.drawState,
      numberDrawn,
      and(pokemonFilter, not(targetCardFilter)),
      true,
    )

  const nonTargetPokemonReturnedCount = sumCardCount(cardsReturned)

  // check if we were actually able to send that many non target pokemon back.
  // if not, return target pokemon as well
  if (nonTargetPokemonReturnedCount < numberDrawn) {
    const targetPokemonToReturnCount =
      numberDrawn - nonTargetPokemonReturnedCount
    return drawMany(
      drawStateAfterReturning,
      targetPokemonToReturnCount,
      and(pokemonFilter, targetCardFilter),
      true,
    ).drawState
  }

  // otherwise there are no more changes to be made
  return drawStateAfterReturning
}

const copycatEffect = (drawState: DrawState) => {
  // add all cards from hand back to deck
  const deckAfterReturn = returnHandToDeck(drawState)

  // draw 3 cards back
  return drawMany(deckAfterReturn, 3).drawState
}

const lisiaEffect = (drawState: DrawState) =>
  drawMany(drawState, 2, lisiaFilter).drawState

const serenaEffect = (drawState: DrawState) =>
  drawByFilter(drawState, megaEvolutionExPokemonFilter).drawState

/**
 * helper to generate simple search effect card play condition,
 * that the deck must contain at least one of the specified card names
 *  */
const simpleSearchEffectCardPlayCondition =
  (...searchCardNames: string[]) =>
  (drawState: DrawState) =>
    cardListHasCard(drawState.deck, cardNameFilter(...searchCardNames))

/**
 * helper to generate simple search effect card play effect
 * that allows drawing cards based on specified card names
 */
const playSimpleSearchCardEffect =
  (searchCardNames: string[], searchCount: number) => (drawState: DrawState) =>
    drawMany(drawState, searchCount, cardNameFilter(...searchCardNames))
      .drawState

// definitions of simple search supporter cards that get 1 random card of several by name
const searchSupporterCardDefs: SearchEffectCardDef[] = [
  {
    name: CARD_NAMES.gladion,
    searchCards: [CARD_NAMES.type_null, CARD_NAMES.silvally],
  },
  {
    name: CARD_NAMES.team_galactic_grunt,
    searchCards: [CARD_NAMES.glameow, CARD_NAMES.stunky, CARD_NAMES.croagunk],
  },
  {
    name: CARD_NAMES.clemont,
    searchCards: [
      CARD_NAMES.magneton,
      CARD_NAMES.heliolisk,
      CARD_NAMES.clemonts_backpack,
    ],
    searchCount: 2,
  },
]

// generate effect cards from simple search supporter card definitions
const searchSupporterEffectCards: EffectCard[] = searchSupporterCardDefs.map(
  (def) => ({
    name: def.name,
    playCondition: simpleSearchEffectCardPlayCondition(...def.searchCards),
    playConditionDescription: `Deck currently has a ${
      def.searchCards.length > 1
        ? def.searchCards.slice(0, -1).join(', ') +
          ', or ' +
          def.searchCards.at(-1)
        : def.searchCards[0]
    }`,
    playEffect: playSimpleSearchCardEffect(
      def.searchCards,
      def.searchCount ?? 1,
    ),
  }),
)

export const supporterEffectCards: EffectCard[] = [
  {
    name: CARD_NAMES.professors_research,
    playCondition: (drawState) => drawState.deck.length >= 1,
    playConditionDescription: 'Deck currently has at least 1 card',
    playEffect: professorsResearchEffect,
  },
  {
    name: CARD_NAMES.lisia,
    playCondition: (drawState) => drawState.deck.some(lisiaFilter),
    playConditionDescription:
      'Deck currently has at least 1 basic Pokémon with 50 HP or less',
    playEffect: lisiaEffect,
  },
  {
    name: CARD_NAMES.serena,
    playCondition: (drawState) =>
      drawState.deck.some(megaEvolutionExPokemonFilter),
    playConditionDescription:
      'Deck currently has at least 1 Mega Evolution Pokémon ex',
    playEffect: serenaEffect,
  },
  ...searchSupporterEffectCards,
  {
    name: CARD_NAMES.may,
    playCondition: mayCondition,
    playConditionDescription:
      'Deck currently has at least 1 target Pokémon and hand has at least 1 non-target Pokémon',
    notes:
      'May will attempt to swap as many non-target Pokémon in hand for target Pokémon in deck',
    playEffect: mayEffect,
  },
  {
    name: CARD_NAMES.copycat,
    playCondition: handHasNoTargetCardsCondition,
    playConditionDescription: 'Hand has no target cards',
    notes:
      'Copycat will shuffle the hand into the deck and draw 3 cards (this represents an average draw)',
    playEffect: copycatEffect,
  },
  {
    name: CARD_NAMES.iono,
    playCondition: handHasNoTargetCardsCondition,
    playConditionDescription: 'Hand has no target cards',
    playEffect: ionoEffect,
  },
  {
    name: CARD_NAMES.traveling_merchant,
    playCondition: (drawState) => drawState.deck.some(toolFilter),
    playConditionDescription: 'Deck currently has at least 1 tool card',
    playEffect: travelingMerchantEffect,
  },
]

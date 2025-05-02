import { pokeballFilter, profResearchFilter } from './cardFilters'
import {
  decrementCardInHand,
  drawBasic,
  drawMany,
  sumCardCount,
} from './handDeckUtils'
import type { MultiPokeCard } from './utils'

export const usePokeball = (hand: MultiPokeCard[], deck: MultiPokeCard[]) => {
  const pokeball = hand.find(pokeballFilter)

  if (!pokeball) {
    return { newHand: hand, newDeck: deck }
  }

  const { newHand: handAfterDecrement } = decrementCardInHand(
    hand,
    pokeballFilter,
  )

  return drawBasic(handAfterDecrement, deck)
}

export const useProfessorsResearch = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
) => {
  const research = hand.find(profResearchFilter)

  if (!research) {
    return { newHand: hand, newDeck: deck }
  }

  const { newHand: handAfterDecrement } = decrementCardInHand(
    hand,
    profResearchFilter,
  )

  // draw up to 2 cards if there are enough in deck
  return drawMany(handAfterDecrement, deck, Math.min(2, sumCardCount(deck)))
}

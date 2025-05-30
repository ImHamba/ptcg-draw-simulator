import {
  basicPokemonFilter,
  gladionFilter,
  gladionSearchFilter,
  pokeballFilter,
  profResearchFilter,
} from './cardFilters'
import {
  cardListHasCard,
  decrementCardByCondition,
  drawByFilter,
  drawMany,
  playAllCards,
  sumCardCount,
} from './handDeckUtils'
import type { CardFilter, MultiPokeCard } from './types'

/**
 * Plays a card that fetches from deck according to a condition.
 * E.g. pokeball fetches a card that is a basic.
 *
 * `cardToPlayFilter` - filter of the card being played, e.g. filter of pokeball
 *
 * `cardToDrawFilter` - filter of the card being fetched from deck, e.g. filter of basic pokemon
 */
export const playCardThatDrawsByFilter = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
  cardToPlayFilter: CardFilter,
  cardToDrawFilter: CardFilter,
) => {
  const cardToPlay = hand.find(cardToPlayFilter)

  if (!cardToPlay) {
    return { newHand: hand, newDeck: deck }
  }

  const handAfterDecrement = decrementCardByCondition(hand, cardToPlayFilter)

  const drawResult = drawByFilter(handAfterDecrement, deck, cardToDrawFilter)
  return drawResult
}

export const playPokeball = (hand: MultiPokeCard[], deck: MultiPokeCard[]) =>
  playCardThatDrawsByFilter(hand, deck, pokeballFilter, basicPokemonFilter)

export const playGladion = (hand: MultiPokeCard[], deck: MultiPokeCard[]) =>
  playCardThatDrawsByFilter(hand, deck, gladionFilter, gladionSearchFilter)

export const playProfessorsResearch = (
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

export const playSpecialCards = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
) => {
  const { newHand: handAfterPokeball, newDeck: deckAfterPokeball } =
    playAllCards(hand, deck, playPokeball, pokeballFilter)

  // play up to 1 supporter from hand
  const { newHand: handAfterSupporter, newDeck: deckAfterSupporter } =
    // play prof research if in hand
    cardListHasCard(handAfterPokeball, profResearchFilter)
      ? playProfessorsResearch(handAfterPokeball, deckAfterPokeball)
      : // play gladion if in hand
        cardListHasCard(handAfterPokeball, gladionFilter)
        ? playGladion(handAfterPokeball, deckAfterPokeball)
        : // otherwise dont change deck/hand
          { newHand: handAfterPokeball, newDeck: deckAfterPokeball }

  // TODO: work out why using pokeballs after research reduces chance to get target hand
  // return { newHand: handAfterResearch, newDeck: deckAfterResearch }
  // use pokeball again that might be drawn by prof research
  return playAllCards(
    handAfterSupporter,
    deckAfterSupporter,
    playPokeball,
    pokeballFilter,
  )
}

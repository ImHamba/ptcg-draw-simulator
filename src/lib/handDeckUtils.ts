import {
  useProfessorsResearch as playProfessorsResearch,
  usePokeball,
} from './cardEffects'
import {
  basicPokemonFilter,
  otherCardFilter,
  pokeballFilter,
} from './cardFilters'
import { FIRST_HAND_SIZE, MAX_DECK_SIZE } from './constants'

import type {
  CardFilter,
  MultiCardWithCumuCount,
  MultiPokeCard,
  PokeCard,
  TargetHands,
} from './appUtils'
import { isSameCard } from './appUtils'
import { conditionalListItem, getRandomInt, sum } from './utils'

export const drawFromDeck = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
  filter?: CardFilter,
) => {
  if (deck.length === 0) {
    throw Error(`Tried to draw from empty deck.`)
  }

  // calculate cumulative counts of cards through the deck
  const deckWithCumuCounts = deck.reduce((acc, card) => {
    const includeCard = filter?.(card) ?? true
    const previousCount = acc.at(-1)?.cumuCount ?? 0

    // if cumulative count only increments for included cards, then they won't
    // be able to be selected later on
    const cumuCount = previousCount + (includeCard ? card.count : 0)
    return [...acc, { ...card, cumuCount: cumuCount }]
  }, [] as MultiCardWithCumuCount[])

  // pick a random number within the size of the deck
  const deckSize = deckWithCumuCounts.at(-1)?.cumuCount ?? 0
  const drawIndex = getRandomInt(deckSize)

  // extract the card corresponding to the draw index and decrement the count of that card
  const { drawnCard, newDeck } = deckWithCumuCounts.reduce(
    (acc, card) => {
      if (
        acc.drawnCard === null &&
        (acc.newDeck.at(-1)?.cumuCount ?? 0) <= drawIndex &&
        drawIndex < card.cumuCount
      ) {
        const newCount = card.count - 1
        return {
          drawnCard: card,
          newDeck: [
            ...acc.newDeck,
            // remove card from deck if count reaches 0
            ...conditionalListItem({ ...card, count: newCount }, newCount > 0),
          ],
        }
      }

      return { drawnCard: acc.drawnCard, newDeck: [...acc.newDeck, card] }
    },
    {
      drawnCard: null as PokeCard | null,
      newDeck: [] as MultiCardWithCumuCount[],
    },
  )

  if (!drawnCard) {
    throw Error(
      `Error drawing card from deck:\ndraw index: ${drawIndex}\ndeck: ${JSON.stringify(deck, null, 2)}`,
    )
  }

  // increment the drawn card in hand if its already held, otherwise append it to the end
  let cardAlreadyInHand = false
  const incrementedHand = hand.map((handCard) => {
    if (isSameCard(drawnCard, handCard)) {
      cardAlreadyInHand = true
      return { ...handCard, count: handCard.count + 1 }
    }

    return handCard
  })

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const newHand = cardAlreadyInHand
    ? incrementedHand
    : [...hand, { ...drawnCard, count: 1 }]

  return { newDeck, newHand, drawnCard }
}

export const drawMany = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
  numberOfCards: number = 1,
  filter?: CardFilter,
) => {
  const arr: number[] = Array(numberOfCards).fill(0)
  return arr.reduce(
    ({ newHand, newDeck, drawnCards }, _) => {
      const drawResult = drawFromDeck(newHand, newDeck, filter)
      return {
        ...drawResult,
        drawnCards: [...drawnCards, drawResult.drawnCard],
      }
    },
    {
      newDeck: deck,
      newHand: hand,
      drawnCards: [] as PokeCard[],
    },
  )
}

export const drawFirstHand = (deck: MultiPokeCard[]) => {
  if (!deck.find(basicPokemonFilter)) {
    throw Error('Tried to draw first hand from deck without basics.')
  }

  let newHand: MultiPokeCard[] = []
  let newDeck: MultiPokeCard[] = deck

  while (!newHand.some(basicPokemonFilter)) {
    newHand = []

    const drawResult = drawMany(newHand, deck, FIRST_HAND_SIZE)
    newHand = drawResult.newHand
    newDeck = drawResult.newDeck
  }

  return { newHand, newDeck }
}

export const decrementCardByCondition = (
  cards: MultiPokeCard[],
  condition: CardFilter,
) => {
  const cardToRemove = cards.find(condition)

  if (!cardToRemove) {
    return cards
  }

  return cardToRemove.count <= 1
    ? // remove card entirely if only 1 copy
      cards.filter((card) => !condition(card))
    : // if many of the card, decrement count
      cards.map((card) =>
        condition(card) ? { ...card, count: card.count - 1 } : card,
      )
}

export const incrementCard = (
  cards: MultiPokeCard[],
  card: PokeCard,
): MultiPokeCard[] => {
  const hasCardAlready = cards.find((c) => isSameCard(c, card))

  return hasCardAlready
    ? cards.map((c) => {
        return c === hasCardAlready ? { ...c, count: c.count + 1 } : c
      })
    : [...cards, { ...card, count: 1 }]
}
export const decrementCard = (
  cards: MultiPokeCard[],
  card: PokeCard,
): MultiPokeCard[] => {
  const hasCardAlready = cards.find((c) => isSameCard(c, card))

  if (!hasCardAlready) {
    return cards
  }

  return hasCardAlready.count <= 1
    ? cards.filter((c) => c !== hasCardAlready)
    : cards.map((c) =>
        c === hasCardAlready ? { ...c, count: c.count - 1 } : c,
      )
}

export const sumCardCount = (cards: MultiPokeCard[], filter?: CardFilter) => {
  const filteredCards = filter ? cards.filter(filter) : cards
  return sum(filteredCards.map((card) => card.count))
}

export const drawBasic = (hand: MultiPokeCard[], deck: MultiPokeCard[]) => {
  const basicPokemonInDeck = sumCardCount(deck, basicPokemonFilter)
  return drawMany(
    hand,
    deck,
    // draw 1 if the deck has it
    Math.min(1, basicPokemonInDeck),
    basicPokemonFilter,
  )
}

const addCardToCardList = (
  card: PokeCard,
  cardList: MultiPokeCard[],
  numberToAdd: number,
) => {
  const cardListHasCardAlready = cardList.some((listCard) =>
    isSameCard(listCard, card),
  )

  // if card already in card list, increment its count
  if (cardListHasCardAlready) {
    return cardList.map((listCard) =>
      isSameCard(listCard, card)
        ? { ...listCard, count: listCard.count + numberToAdd }
        : listCard,
    )
  }

  // otherwise add it
  return [...cardList, { ...card, count: numberToAdd }]
}

export const addCardToDeck = (
  card: PokeCard,
  deck: MultiPokeCard[],
  originalDeck: MultiPokeCard[],
  numberToAdd = 1,
) => {
  return {
    newOriginalDeck: fillDeck(
      addCardToCardList(card, originalDeck, numberToAdd),
    ),
    newDeck: fillDeck(
      addCardToCardList(card, deck, numberToAdd),
      sumCardCount(deck),
    ),
  }
}

export const fillDeck = (
  deck: MultiPokeCard[],
  targetSize = MAX_DECK_SIZE,
): MultiPokeCard[] => {
  const withoutOther = deck.filter((card) => !otherCardFilter(card))
  const sizeWithoutOther = sumCardCount(withoutOther)

  // if increasing size, add Other cards
  if (sizeWithoutOther < targetSize) {
    const newDeck: MultiPokeCard[] = [
      ...withoutOther,
      {
        cardType: 'other',
        count: targetSize - sizeWithoutOther,
      },
    ]

    return newDeck
  }
  // if reducing size, remove Other cards
  else if (sizeWithoutOther > targetSize) {
    const other = deck.find(otherCardFilter)
    if (!other) {
      throw Error(
        'Can not resize deck without Other cards to smaller target size.',
      )
    }

    const newDeck: MultiPokeCard[] = [
      ...withoutOther,
      {
        ...other,
        count: other.count - (sizeWithoutOther - targetSize),
      },
    ]

    return newDeck
  }

  return withoutOther
}

export const initialDeck: MultiPokeCard[] = fillDeck([])

export const initialTargetHands: TargetHands = {}

export const initialHand: MultiPokeCard[] = []

export const resetDeckAndHand = (originalDeck: MultiPokeCard[]) => {
  return {
    newDeck: originalDeck,
    newHand: initialHand,
  }
}

export const resetOriginalDeck = () => {
  return {
    newDeck: fillDeck([]),
    newOriginalDeck: fillDeck([]),
    newHand: [],
  }
}

export const resetAllAndAddCard = (
  card: PokeCard,
  originalDeck: MultiPokeCard[],
) => {
  const { newHand, newDeck } = resetDeckAndHand(originalDeck)
  return {
    ...addCardToDeck(card, newDeck, originalDeck),
    newHand: newHand,
  }
}

export const addTargetCard = (
  card: PokeCard,
  targetHandId: string,
  existingTargetHands: TargetHands,
  numberToAdd = 1,
) => {
  const addTo = existingTargetHands[targetHandId] ?? []

  return {
    newTargetHands: {
      ...existingTargetHands,
      [targetHandId]: addCardToCardList(card, addTo, numberToAdd),
    },
  }
}

type useCard = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
) => {
  newHand: MultiPokeCard[]
  newDeck: MultiPokeCard[]
}

export const playAllCards = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
  playCard: useCard,
  cardFilter: CardFilter,
) => {
  let newHand = hand
  let newDeck = deck
  while (newHand.some(cardFilter)) {
    ;({ newHand, newDeck } = playCard(newHand, newDeck))
  }

  return { newHand, newDeck }
}

export const playSpecialCards = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
) => {
  const { newHand: handAfterPokeball, newDeck: deckAfterPokeball } =
    playAllCards(hand, deck, usePokeball, pokeballFilter)

  // only uses if hand contains a prof research
  const { newHand: handAfterResearch, newDeck: deckAfterResearch } =
    playProfessorsResearch(handAfterPokeball, deckAfterPokeball)

  // TODO: work out why using pokeballs after research reduces chance to get target hand
  // return { newHand: handAfterResearch, newDeck: deckAfterResearch }
  // use pokeball again that might be drawn by prof research
  return playAllCards(
    handAfterResearch,
    deckAfterResearch,
    usePokeball,
    pokeballFilter,
  )
}

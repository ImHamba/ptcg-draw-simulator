import { basicPokemonFilter, otherCardFilter } from './cardFilters'
import { FIRST_HAND_SIZE, MAX_DECK_SIZE } from './constants'

import { isSameCard, isSameNameCard } from './appUtils'
import type {
  CardFilter,
  DrawState,
  HandDeckStateChanger,
  MultiCardWithCumuCount,
  MultiPokeCard,
  PokeCard,
  TargetHands,
} from './types'
import { conditionalListItem, getRandomInt, sum } from './utils'

/**
 * Draws a random card from the deck, optionally filtered by a card filter condition.
 */
export const drawFromDeck = (drawState: DrawState, filter?: CardFilter) => {
  const hand = drawState.hand
  const deck = drawState.deck

  if (deck.length === 0) {
    throw Error(`Tried to draw from empty deck.`)
  }

  // calculate cumulative counts of cards through the deck
  const deckWithCumuCounts = deck.reduce<MultiCardWithCumuCount[]>(
    (acc, card) => {
      const includeCard = filter?.(card) ?? true
      const previousCount = acc.at(-1)?.cumuCount ?? 0

      // if cumulative count only increments for included cards, then they won't
      // be able to be selected later on
      const cumuCount = previousCount + (includeCard ? card.count : 0)
      return [...acc, { ...card, cumuCount: cumuCount }]
    },
    [],
  )

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

  return { drawState: { deck: newDeck, hand: newHand }, drawnCard }
}

/**
 * Draws a number of cards from the deck, optionally filtered by a card filter condition.
 * Can also draw in reverse, meaning cards are sent from hand to deck instead.
 */
export const drawMany = (
  drawState: DrawState,
  numberOfCards: number = 1,
  filter?: CardFilter,
  reverse: boolean = false,
) => {
  // if reverse, temporarily swap the hand and deck for the following reduce logic
  const initialDrawState = reverse
    ? { hand: drawState.deck, deck: drawState.hand }
    : drawState

  const arr: number[] = Array(numberOfCards).fill(0)
  const drawResult = arr.reduce(
    ({ drawState, drawnCards }, _) => {
      // cannot draw more if deck is empty or has no more cards left that match the filter
      if (
        drawState.deck.length === 0 ||
        (filter && !drawState.deck.some(filter))
      ) {
        return { drawState, drawnCards }
      }

      const drawResult = drawFromDeck(drawState, filter)
      const drawnCardsResult = addCardToCardList(
        drawResult.drawnCard,
        drawnCards,
        1,
      )

      return {
        drawState: drawResult.drawState,
        drawnCards: drawnCardsResult,
      }
    },
    {
      drawState: initialDrawState,
      drawnCards: [] as MultiPokeCard[],
    },
  )

  // if reverse, swap the hand and deck back
  return reverse
    ? {
        drawState: {
          hand: drawResult.drawState.deck,
          deck: drawResult.drawState.hand,
        },
        drawnCards: drawResult.drawnCards,
      }
    : drawResult
}

export const drawFirstHand = (deck: MultiPokeCard[]) => {
  if (!deck.find(basicPokemonFilter)) {
    throw Error('Tried to draw first hand from deck without basics.')
  }

  const initialDrawState = { hand: [], deck: deck }
  let drawState: DrawState = initialDrawState

  // keep drawing first hand until at least one basic is drawn
  while (!drawState.hand.some(basicPokemonFilter)) {
    drawState = initialDrawState

    const firstDrawResult = drawMany(drawState, FIRST_HAND_SIZE)
    drawState = firstDrawResult.drawState
  }

  return drawFromDeck(drawState)
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

export const drawByFilter = (
  drawState: DrawState,
  cardFilter: CardFilter,
): { drawState: DrawState; drawnCard?: PokeCard } => {
  const matchingCardsInDeck = sumCardCount(drawState.deck, cardFilter)

  if (matchingCardsInDeck === 0) {
    return { drawState }
  }

  return drawFromDeck(drawState, cardFilter)
}

export const drawBasic = (drawState: DrawState) =>
  drawByFilter(drawState, basicPokemonFilter)

export const addCardToCardList = (
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

export const resetDeckAndHand = (originalDeck: MultiPokeCard[]): DrawState => {
  return {
    deck: originalDeck,
    hand: initialHand,
  }
}

export const resetOriginalDeck: HandDeckStateChanger = () => {
  return {
    drawState: {
      deck: fillDeck([]),
      hand: [],
    },
    newOriginalDeck: fillDeck([]),
  }
}

export const resetAllAndAddCard: HandDeckStateChanger = (
  card: PokeCard,
  originalDeck: MultiPokeCard[],
  numberToAdd: number = 1,
) => {
  const newState = adaptToFullState(resetDeckAndHand)(originalDeck)

  const { newDeck, newOriginalDeck } = addCardToDeck(
    card,
    newState.drawState.deck,
    originalDeck,
    numberToAdd,
  )

  return {
    newOriginalDeck,
    drawState: { hand: newState.drawState.hand, deck: newDeck },
  }
}

export const sameNameCardsCount = (
  card: PokeCard,
  cardsList: MultiPokeCard[],
) =>
  sum(
    cardsList.map((listCard) =>
      isSameNameCard(listCard, card) ? listCard.count : 0,
    ),
  )

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

export const cardListHasCard = (
  cardList: MultiPokeCard[],
  hasCardFilter: CardFilter,
) => Boolean(cardList.find(hasCardFilter))

export const countInCardListByFilter = (
  cardList: MultiPokeCard[],
  hasCardFilter: CardFilter,
) =>
  cardList.reduce((count, card) => {
    return hasCardFilter(card) ? count + card.count : count
  }, 0)

/**
 * Convenience function to wrap a function returning `DrawState` into a function returning
 * an object compatible with `Partial<FullState>` for use in state management
 */
export const adaptToFullState = (
  fn: (...args: any[]) => DrawState,
): ((...args: any[]) => { drawState: DrawState }) => {
  return (...args) => ({ drawState: fn(...args) })
}

export const targetHandsHaveCard = (
  targetHands: TargetHands,
  hasCardFilter: CardFilter,
) =>
  Object.values(targetHands).some((hand) =>
    cardListHasCard(hand, hasCardFilter),
  )

export const returnHandToDeck = (drawState: DrawState): DrawState => {
  // add all cards from hand back to deck
  const deckAfterReturn = drawState.hand.reduce(
    (deck, handCard) => addCardToCardList(handCard, deck, handCard.count),
    drawState.deck,
  )

  // hand is now empty
  return { hand: [], deck: deckAfterReturn }
}

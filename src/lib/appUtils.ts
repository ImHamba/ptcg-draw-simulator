import { v4 as uuidv4 } from 'uuid'

import { otherCardFilter } from './cardFilters'
import {
  BASIC_CARD_IMG_URL,
  CARD_DELIMITER,
  CARD_IMG_API_URL,
  COUNT_ID_DELIMITER,
  DECK_SEARCH_PARAM,
  DEFAULT_CARD_IMG_URL,
  GENERIC_CARD_TYPES,
  TARGET_HANDS_SEARCH_PARAM,
  TARGET_HAND_DELIMITER,
} from './constants'
import { fillDeck } from './handDeckUtils'
import type { CardData } from './utils'
import { clearUrlParams, not } from './utils'

export const decodeCardsCode = (cardsCode: string, cardData: CardData[]) => {
  try {
    const cards: MultiPokeCard[] = cardsCode
      .split(CARD_DELIMITER)
      .map((card) => {
        const [countStr, cardId] = card.split(COUNT_ID_DELIMITER)
        const count = parseInt(countStr)

        if (isGenericCardType(cardId)) {
          return {
            cardType: cardId,
            count: count,
          }
        }

        const data = cardData.find((card) => card.id === cardId)

        // cancel operation if cant find the card id
        if (!data) {
          throw Error()
        }

        return {
          data: data,
          count: count,
        }
      })

    return cards
  } catch {
    // if any error occured while parsing deck string, clear the url params
    clearUrlParams()
    return []
  }
}

export const decodeDeckCode = (deckCode: string, cardData: CardData[]) => {
  return fillDeck(decodeCardsCode(deckCode, cardData))
}

export const decodeTargetHandsCode = (
  targetHandsCode: string,
  cardData: CardData[],
): TargetHands => {
  return Object.fromEntries(
    targetHandsCode.split(TARGET_HAND_DELIMITER).map((targetHandCode) => [
      uuidv4(), // generate a new target hand id
      decodeCardsCode(targetHandCode, cardData),
    ]),
  )
}

export const generateEncodedCardsString = (
  cards: MultiPokeCard[],
  includeOther = false,
) => {
  const filtered = includeOther ? cards : cards.filter(not(otherCardFilter))
  const dataString = filtered
    .map((card) => {
      return `${card.count}${COUNT_ID_DELIMITER}${card.cardType ?? card.data.id}`
    })
    .join(CARD_DELIMITER)

  const encodedString = encodeURIComponent(dataString)
  return encodedString
}

export const generateEncodedTargetHandsString = (targetHands: TargetHands) => {
  return Object.values(targetHands)
    .map((targetHand) => generateEncodedCardsString(targetHand, true))
    .join(TARGET_HAND_DELIMITER)
}

export const generateShareLink = (
  cards: MultiPokeCard[] | null,
  targetHands: TargetHands | null,
  includeOther = false,
  router
) => {
  const deckEncodedString = cards
    ? generateEncodedCardsString(cards, includeOther)
    : null
  const targetHandsEncodedString = targetHands
    ? generateEncodedTargetHandsString(targetHands)
    : null

  const baseUrl = `${window.location.protocol}//${window.location.host}`

  const routeString = router.buildLocation({
    // defaults path to where ever this is being called from, i.e. /simulator
    to: './',
    search: {
      ...(deckEncodedString && { [DECK_SEARCH_PARAM]: deckEncodedString }),
      ...(targetHandsEncodedString && {
        [TARGET_HANDS_SEARCH_PARAM]: targetHandsEncodedString,
      }),
    },
  }).href

  return baseUrl + routeString
}

export type CardType = (typeof GENERIC_CARD_TYPES)[number]

export type PokeCard =
  | {
      cardType: CardType
      data?: CardData
    }
  | {
      cardType?: CardType
      data: CardData
    }

export type MultiPokeCard = PokeCard & {
  count: number
}

export type CardFilter = (card: PokeCard) => boolean

export const isSameCard = (card1: PokeCard, card2: PokeCard) => {
  return card1.cardType === card2.cardType && card1.data?.id === card2.data?.id
}

export const isEquivalentCard = (card1: PokeCard, card2: PokeCard) => {
  // this will catch non specific cards, e.g. `other` or `otherBasic`
  if (isSameCard(card1, card2)) {
    return true
  }

  // both cards must be specific cards to be considered equivalent
  if (!card1.data || !card2.data) {
    return false
  }

  if (
    card1.data.name !== card2.data.name ||
    card1.data.type !== card2.data.type
  ) {
    return false
  }

  // name and type are equal at this point
  const type = card1.data.type

  // all non pokemon should have the same effect if they have the same name
  if (type !== 'Pokemon') {
    return true
  }

  // pokemon with the same attacks and abilities are probably equivalent
  if (
    JSON.stringify(card1.data.attack) === JSON.stringify(card2.data.attack) &&
    JSON.stringify(card1.data.ability) === JSON.stringify(card2.data.ability)
  ) {
    return true
  }

  return false
}

export const checkHandMatchesTargetHand = (
  hand: MultiPokeCard[],
  targetHand: MultiPokeCard[],
) =>
  // check that for every target card, the hand contains at least that number of them
  targetHand.every((targetCard) => {
    const handCard = hand.find((handCard) => isSameCard(handCard, targetCard))
    return (handCard?.count ?? 0) >= targetCard.count
  })

export const checkHandMatchesTargetHands = (
  hand: MultiPokeCard[],
  targetHands: TargetHands,
): Record<string, boolean> => {
  const entries: [string, boolean][] = Object.entries(targetHands).map(
    ([targetHandId, targetHand]) => [
      targetHandId,
      checkHandMatchesTargetHand(hand, targetHand),
    ],
  )

  const anyMatch = entries.some((entry) => entry[1])

  const matchesObj = Object.fromEntries(entries)

  return {
    ...matchesObj,
    anyMatch: anyMatch,
  }
}

export type HandDeckStateChange = (...args: any[]) => {
  newHand?: MultiPokeCard[]
  newOriginalDeck?: MultiPokeCard[]
  newDeck?: MultiPokeCard[]
  newTargetHands?: TargetHands
}

export type SaveHandDeckState = <T extends HandDeckStateChange>(
  handDeckStateChangeFn: T,
  ...args: Parameters<T>
) => () => void

export const imageUrlFromCard = (card: PokeCard) => {
  const data = card.data

  if (card.cardType === 'basicOther') {
    return BASIC_CARD_IMG_URL
  }

  if (!data || card.cardType === 'other') {
    return DEFAULT_CARD_IMG_URL
  }

  // translation between dotgg and limitless set
  const setCode = data.set_code === 'PROMO' ? 'P-A' : data.set_code
  return `${CARD_IMG_API_URL}${setCode}/${setCode}_${data.number.padStart(3, '0')}_EN.webp`
}

export const isGenericCardType = (value: string): value is CardType => {
  return (GENERIC_CARD_TYPES as readonly string[]).includes(value)
}

export type TargetHands = Record<string, MultiPokeCard[]>

export type MultiCardWithCumuCount = MultiPokeCard & { cumuCount: number }

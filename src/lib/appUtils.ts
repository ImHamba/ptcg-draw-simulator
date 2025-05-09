import { v4 as uuidv4 } from 'uuid'
import { otherCardFilter } from './cardFilters'
import {
  CARD_DELIMITER,
  COUNT_ID_DELIMITER,
  DECK_SEARCH_PARAM,
  TARGET_HAND_DELIMITER,
  TARGET_HANDS_SEARCH_PARAM,
} from './constants'
import { fillDeck, type TargetHands } from './handDeckUtils'
import {
  clearUrlParams,
  isGenericCardType,
  not,
  type CardData,
  type MultiPokeCard,
} from './utils'

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
) => {
  const deckEncodedString = cards
    ? generateEncodedCardsString(cards, includeOther)
    : null
  const targetHandsEncodedString = targetHands
    ? generateEncodedTargetHandsString(targetHands)
    : null

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const url = new URL(baseUrl)

  if (deckEncodedString) {
    url.searchParams.set(DECK_SEARCH_PARAM, deckEncodedString)
  }
  if (targetHandsEncodedString) {
    url.searchParams.set(TARGET_HANDS_SEARCH_PARAM, targetHandsEncodedString)
  }

  return url.toString()
}

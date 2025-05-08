import { otherCardFilter } from './cardFilters'
import {
  CARD_DELIMITER,
  COUNT_ID_DELIMITER,
  URL_DECK_SEARCH_PARAM,
} from './constants'
import { fillDeck } from './handDeckUtils'
import {
  type CardData,
  type MultiPokeCard,
  clearUrlParams,
  isGenericCardType,
  not,
} from './utils'

export const interpretDeckCode = (deckCode: string, cardData: CardData[]) => {
  try {
    const deck: MultiPokeCard[] = deckCode.split(CARD_DELIMITER).map((card) => {
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

    return fillDeck(deck)
  } catch {
    // if any error occured while parsing deck string, clear the url params
    clearUrlParams()
    return fillDeck([])
  }
}

export const generateEncodedDeckString = (originalDeck: MultiPokeCard[]) => {
  const dataString = originalDeck
    // exclude Other cards since they can be repopulated upon import
    .filter(not(otherCardFilter))
    .map((card) => {
      return `${card.count}${COUNT_ID_DELIMITER}${card.cardType ?? card.data.id}`
    })
    .join(CARD_DELIMITER)

  const encodedString = encodeURIComponent(dataString)
  return encodedString
}

export const generateShareLink = (originalDeck: MultiPokeCard[]) => {
  const encodedString = generateEncodedDeckString(originalDeck)
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const url = new URL(baseUrl)
  url.searchParams.set(URL_DECK_SEARCH_PARAM, encodedString)

  return url.toString()
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type CardType =
  | 'basicUserDefined'
  | 'basicOther'
  | 'otherUserDefined'
  | 'professorsResearch'
  | 'pokeball'
  | 'other'

export type PokeCard = {
  name?: string | undefined
  cardType: CardType
}
export type MultiPokeCard = PokeCard & {
  count: number
}
export type CardFilter = (card: PokeCard) => boolean

/**
 * Sums numbers in a list
 */
export const sum = (numbers: number[]) =>
  numbers.reduce((acc, curr) => acc + curr, 0)

/**
 *  sums all numbers in a nested object
 */
export const sumObjectNumbers = (obj: any): number => {
  if (typeof obj === 'number') {
    return obj
  } else if (typeof obj === 'object' && obj !== null) {
    return sum(
      Object.values(obj).map((objValue: any) => sumObjectNumbers(objValue)),
    )
  }

  return 0
}

/**
 * Returns object excluding the given list of keys
 */
export const omitKeys = <T extends object, K extends keyof T>(
  obj: T,
  keysToOmit: K[],
) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToOmit.includes(key as K)),
  ) as Omit<T, K>
}

export const isSameCard = (card1: PokeCard, card2: PokeCard) => {
  return card1.cardType === card2.cardType && card1.name === card2.name
}

export const checkHandMatchesDesiredHand = (
  hand: MultiPokeCard[],
  desiredHand: MultiPokeCard[],
) =>
  // check that for every desired card, the hand contains at least that number of them
  desiredHand.every((desiredCard) => {
    const handCard = hand.find((handCard) => isSameCard(handCard, desiredCard))
    return (handCard?.count ?? 0) >= desiredCard.count
  })

/**
 * returns random int from 0 to max-1
 */
export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max)
}

export const conditionalListItem = <T>(
  item: T | T[],
  condition?: boolean,
): T[] => {
  const includeItem =
    condition !== undefined ? condition : item !== null && item !== undefined

  return includeItem ? (Array.isArray(item) ? item : [item]) : []
}

export type HandDeckStateChange = (...args: any[]) => {
  newHand?: MultiPokeCard[]
  newDeck?: MultiPokeCard[]
}

export type CardData = {
  id: string
  set_code: string
  number: string
  name: string
  set_name: string
  color: string
  stage: string
}

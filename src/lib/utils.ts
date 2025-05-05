import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import {
  BASIC_CARD_IMG_URL,
  CARD_IMG_API_URL,
  DEFAULT_CARD_IMG_URL,
} from './cardData'
import type { TargetHands } from './handDeckUtils'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type CardType = 'basicOther' | 'other'

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
  return card1.cardType === card2.cardType && card1.data?.id === card2.data?.id
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
) => {
  const entries: [string, boolean][] = Object.entries(targetHands).map(
    ([targetHandId, targetHand]) => [
      targetHandId,
      checkHandMatchesTargetHand(hand, targetHand),
    ],
  )

  const anyMatch = entries.some((entry) => entry[1])

  return { targetHandMatches: Object.fromEntries(entries), anyMatch }
}

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
  newOriginalDeck?: MultiPokeCard[]
  newDeck?: MultiPokeCard[]
  newTargetHands?: TargetHands
}

export type SaveHandDeckState = <T extends HandDeckStateChange>(
  handDeckStateChangeFn: T,
  ...args: Parameters<T>
) => () => void

export type CardData = {
  id: string
  set_code: string
  number: string
  name: string
  set_name: string
  color: string
  stage: string
  dex: string
}

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

/**
 * inverts a predicate
 */
export const not = <T extends (...args: any[]) => boolean>(predicate: T) => {
  return (...args: Parameters<T>) => !predicate(...args)
}

/**
 * Adds the corresponding keys of two objects together
 */
export const sumObjects = (
  obj1: Record<string, number | boolean>,
  obj2: Record<string, number | boolean>,
) =>
  Object.fromEntries(
    Object.keys(obj1).map((key) => [
      key,
      Number(obj1[key]) + Number(obj2[key]),
    ]),
  )

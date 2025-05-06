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

export const getHexColorForValue = (
  value: number,
  startHue = 0,
  endHue = 1,
  saturation = 1,
  lightness = 0.8,
) => {
  const min = 0
  const max = 1

  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)))
  const hue = startHue * 360 + (endHue * 360 - startHue * 360) * normalized

  // Convert HSL to RGB
  const h = hue / 360
  const s = saturation
  const l = lightness

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255)
  const g = Math.round(hue2rgb(p, q, h) * 255)
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255)

  // Convert RGB to HEX
  const toHex = (c: number) => c.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

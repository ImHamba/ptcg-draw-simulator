import type { CARD_DATA_PROPERTIES, GENERIC_CARD_TYPES } from './constants'

type Prettify<T> = { [K in keyof T]: T[K] }

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

export type MultiPokeCard = Prettify<
  PokeCard & {
    count: number
  }
>

export type CardFilter = (card: PokeCard) => boolean

export type HandDeckStateChanger = (...args: any[]) => {
  newHand?: MultiPokeCard[]
  newOriginalDeck?: MultiPokeCard[]
  newDeck?: MultiPokeCard[]
  newTargetHands?: TargetHands
}

export type SaveHandDeckState = <T extends HandDeckStateChanger>(
  handDeckStateChangeFn: T,
  ...args: Parameters<T>
) => () => void

export type TargetHands = Record<string, MultiPokeCard[]>

export type MultiCardWithCumuCount = Prettify<
  MultiPokeCard & { cumuCount: number }
>

export type CardData = Record<(typeof CARD_DATA_PROPERTIES)[number], string>
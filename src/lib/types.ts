import type {
  CARD_DATA_PROPERTIES,
  CARD_TYPES,
  GENERIC_CARD_TYPES,
} from './constants'

export type Prettify<T> = { [K in keyof T]: T[K] }

export type GenericCardType = (typeof GENERIC_CARD_TYPES)[number]

export type CardType = (typeof CARD_TYPES)[number]
export type PokemonStage = 'Basic' | 'Stage 1' | 'Stage 2' | null
export type PokemonColor =
  | 'Grass'
  | 'Fire'
  | 'Water'
  | 'Lightning'
  | 'Psychic'
  | 'Fighting'
  | 'Darkness'
  | 'Metal'
  | 'Dragon'
  | 'Colorless'
  | null

export type PokeCard =
  | {
      cardType: GenericCardType
      data?: CardData
    }
  | {
      cardType?: GenericCardType
      data: CardData
    }

export type MultiPokeCard = Prettify<
  PokeCard & {
    count: number
  }
>

export type CardFilter = (card: PokeCard) => boolean

export type DrawState = {
  hand: MultiPokeCard[]
  deck: MultiPokeCard[]
}

export type DeckAndTargetState = {
  newOriginalDeck: MultiPokeCard[]
  newTargetHands: TargetHands
}

export type HandDeckStateChanger = (
  ...args: any[]
) => Partial<DeckAndTargetState>

export type SaveHandDeckState = <T extends HandDeckStateChanger>(
  handDeckStateChangeFn: T,
  ...args: Parameters<T>
) => () => void

export type TargetHands = Record<string, MultiPokeCard[]>

export type MultiCardWithCumuCount = Prettify<
  MultiPokeCard & { cumuCount: number }
>

export type CardData = {
  [K in (typeof CARD_DATA_PROPERTIES)[number]]: K extends 'count'
    ? number
    : K extends 'type'
      ? CardType
      : K extends 'stage'
        ? PokemonStage
        : K extends 'color'
          ? PokemonColor
          : string
}

export type SearchEffectCardDef = {
  name: string
  searchCards: string[]
  searchCount?: number
}

export type EffectCard = {
  name: string
  playCondition: (drawState: DrawState, targetHands: TargetHands) => boolean
  playConditionDescription: string
  playEffect: (drawState: DrawState, targetHands: TargetHands) => DrawState
  notes?: string
}
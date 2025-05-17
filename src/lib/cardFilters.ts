import {
  BASIC_STAGE,
  POKEBALL_CARD_NAME,
  PROFESSORS_RESEARCH_CARD_NAME,
} from './constants'
import type { CardFilter } from './types'

export const basicPokemonFilter: CardFilter = (card) =>
  card.cardType === 'basicOther' || card.data?.stage === BASIC_STAGE

export const pokeballFilter: CardFilter = (card) =>
  card.data?.name === POKEBALL_CARD_NAME

export const profResearchFilter: CardFilter = (card) =>
  card.data?.name === PROFESSORS_RESEARCH_CARD_NAME

export const otherCardFilter: CardFilter = (card) => card.cardType === 'other'

import { BASIC_STAGE, POKEBALL_ID, PROFESSORS_RESEARCH_ID } from './constants'
import type { CardFilter } from './utils'

export const basicPokemonFilter: CardFilter = (card) =>
  card.cardType === 'basicOther' || card.data?.stage === BASIC_STAGE

export const pokeballFilter: CardFilter = (card) =>
  card.data?.id === POKEBALL_ID

export const profResearchFilter: CardFilter = (card) =>
  card.data?.id === PROFESSORS_RESEARCH_ID

export const otherCardFilter: CardFilter = (card) => card.cardType === 'other'

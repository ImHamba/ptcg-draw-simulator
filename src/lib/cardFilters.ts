import type { CardFilter } from './utils'

export const basicPokemonFilter: CardFilter = (card) =>
  card.cardType === 'basicOther' || card.cardType === 'basicUserDefined'

export const pokeballFilter: CardFilter = (card) => card.cardType === 'pokeball'
export const profResearchFilter: CardFilter = (card) =>
  card.cardType === 'professorsResearch'

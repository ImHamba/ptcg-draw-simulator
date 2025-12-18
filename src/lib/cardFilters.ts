import { isEquivalentCard } from './appUtils'
import { BASIC_STAGE, CARD_NAMES } from './constants'
import type { CardFilter, PokeCard, PokemonColor } from './types'
import { and } from './utils'

// generates a filter that matches a card by names
export const cardNameFilter =
  (...names: string[]): CardFilter =>
  (card) =>
    card.data?.name ? names.includes(card.data.name) : false

// generic card filters
export const basicPokemonFilter: CardFilter = (card) =>
  pokemonFilter(card) &&
  (card.cardType === 'basicOther' || card.data?.stage === BASIC_STAGE)
export const otherCardFilter: CardFilter = (card) => card.cardType === 'other'
export const pokemonFilter: CardFilter = (card) =>
  card.data?.type === 'Pokemon' || card.cardType === 'basicOther'
export const toolFilter: CardFilter = (card) =>
  card.data?.type === 'Pokémon Tool'
export const createIsEquivalentCardFilter =
  (card: PokeCard): CardFilter =>
  (card2: PokeCard) =>
    isEquivalentCard(card, card2)

// special common card filters
export const pokeballFilter: CardFilter = cardNameFilter(CARD_NAMES.pokeball)
export const profResearchFilter: CardFilter = cardNameFilter(
  CARD_NAMES.professors_research,
)
export const exPokemonFilter: CardFilter = (card) =>
  Boolean(pokemonFilter(card) && card.data?.name.endsWith('ex'))
export const megaPokemonFilter: CardFilter = (card) =>
  Boolean(pokemonFilter(card) && card.data?.name.startsWith('Mega'))
export const evolutionPokemonFilter: CardFilter = (card) =>
  pokemonFilter(card) && card.data?.stage !== 'Basic'
export const megaEvolutionExPokemonFilter: CardFilter = and(
  megaPokemonFilter,
  exPokemonFilter,
  evolutionPokemonFilter,
)
export const createPokemonHpFilter =
  (minHp: number, maxHp: number): CardFilter =>
  (card) => {
    if (!card.data?.hp) {
      return false
    }

    const hp = Number(card.data.hp)
    return pokemonFilter(card) && hp >= minHp && hp <= maxHp
  }
export const createPokemonColorFilter =
  (color: PokemonColor): CardFilter =>
  (card) =>
    pokemonFilter(card) && card.data?.color === color

/** Creates a filter that checks if the pokemon has the previous evolution equal to the given name */
export const createEvolvesIntoFilter = (
  evolvesFromName: string,
): CardFilter => {
  return (card) =>
    evolutionPokemonFilter(card) &&
    card.data?.prew_stage_name === evolvesFromName
}

export const lisiaFilter = and(basicPokemonFilter, createPokemonHpFilter(0, 50))

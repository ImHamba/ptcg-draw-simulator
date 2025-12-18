import {
  basicPokemonFilter,
  createEvolvesIntoFilter,
  createPokemonColorFilter,
} from '../cardFilters'
import { CARD_NAMES } from '../constants'
import { drawByFilter } from '../handDeckUtils'

import type { DrawState, EffectCard } from '../types'
import { and, or } from '../utils'

export const pokeballEffect = (drawState: DrawState) =>
  drawByFilter(drawState, basicPokemonFilter).drawState

const quickGrowExtractCondition = (drawState: DrawState) => {
  const basicGrassesInHand = drawState.hand.filter(
    and(basicPokemonFilter, createPokemonColorFilter('Grass')),
  )
  const basicGrassInHandNames = basicGrassesInHand.flatMap(
    (card) => card.data?.name || [],
  )

  // filters for the evolutions of the basic grass Pokémon in hand
  const evolvesIntoFilters = basicGrassInHandNames.map((name) =>
    createEvolvesIntoFilter(name),
  )

  const evolutionInDeck = drawState.deck.some(or(...evolvesIntoFilters))

  return basicGrassesInHand.length > 0 && evolutionInDeck
}
const quickGrowExtractEffect = (drawState: DrawState) => {
  return drawState
}

export const nonSupporterEffectCards: EffectCard[] = [
  {
    name: CARD_NAMES.pokeball,
    playCondition: () => true,
    playConditionDescription: 'Is always played',
    playEffect: pokeballEffect,
  },
  {
    name: CARD_NAMES.quick_grow_extract,
    playCondition: quickGrowExtractCondition,
    playConditionDescription:
      'Hand has at least 1 basic Grass Pokémon and deck contains its evolution',
    notes:
      'For the purposes of simulation, this just adds the evolution to your hand',
    playEffect: quickGrowExtractEffect,
  },
]

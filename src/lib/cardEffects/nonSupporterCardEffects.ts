import {
  basicPokemonFilter,
  getQuickGrowExtractEvolveFilters,
} from '../cardFilters'
import { CARD_NAMES } from '../constants'
import { drawByFilter } from '../handDeckUtils'

import type { DrawState, EffectCard } from '../types'
import { or } from '../utils'

export const pokeballEffect = (drawState: DrawState) =>
  drawByFilter(drawState, basicPokemonFilter).drawState

const quickGrowExtractCondition = (drawState: DrawState) => {
  const quickGrowEvolveFilters = getQuickGrowExtractEvolveFilters(drawState)
  // filters will only be present for evo pokemon of those in hand, so implicitly covers
  // the in hand requirement of quick grow extract as well
  return drawState.deck.some(or(...quickGrowEvolveFilters))
}

const quickGrowExtractEffect = (drawState: DrawState) => {
  const quickGrowEvolveFilters = getQuickGrowExtractEvolveFilters(drawState)
  return drawByFilter(drawState, or(...quickGrowEvolveFilters)).drawState
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
      'Hand has at least 1 basic Grass Pokémon and deck contains at least 1 of their Grass evolutions',
    notes:
      'For the purposes of simulation, this just adds the evolution to your hand',
    playEffect: quickGrowExtractEffect,
  },
]

import type { PokemonColor } from './types'

export const VERSION = '1.01'

export const BASIC_STAGE = 'Basic'
export const MAX_DECK_SIZE = 20
export const FIRST_HAND_SIZE = 5 // includes first draw
export const MAX_COUNT_PER_CARD_NAME = 2

// delimiters for share link url
export const COUNT_ID_DELIMITER = '.'
export const CARD_DELIMITER = '_'
export const TARGET_HAND_DELIMITER = '~'
export const DECK_SEARCH_PARAM = 'deck'
export const TARGET_HANDS_SEARCH_PARAM = 'target'

// card data fetching
const CORS_PROXY_URL =
  'https://cloudflare-cors-anywhere.callmehamba.workers.dev/?'
export const CARD_DATA_API_URL =
  'https://api.dotgg.gg/cgfw/getcards?game=pokepocket&mode=indexed'
export const CARD_DATA_PROXY_URL = CORS_PROXY_URL + CARD_DATA_API_URL

export const CARD_IMG_API_URL =
  'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/pocket/'
export const DEFAULT_CARD_IMG_URL = 'cardback.png'
export const BASIC_CARD_IMG_URL = 'basic.png'

// properties stored from card data api
export const CARD_DATA_PROPERTIES = [
  'id',
  'set_code',
  'number',
  'name',
  'set_name',
  'color',
  'stage',
  'dex',
  'type',
  'attack',
  'ability',
  'hp',
  'prew_stage_name', // previous stage name
] as const

// card types that represent a generic card without specific data
// (placeholder cards used in the deck maker)
export const GENERIC_CARD_TYPES = ['basicOther', 'other'] as const

// card types (that we care about) that represent specific card categories
// that come from the card data api
export const CARD_TYPES = ['Pokemon', 'Pokémon Tool'] as const

export const POKE_COLORS = {
  grass: 'Grass',
  fire: 'Fire',
  water: 'Water',
  lightning: 'Lightning',
  psychic: 'Psychic',
  fighting: 'Fighting',
  darkness: 'Darkness',
  metal: 'Metal',
  dragon: 'Dragon',
  colorless: 'Colorless',
} satisfies Record<string, PokemonColor>

export const LOCAL_STORAGE_KEYS = {
  simulationLimit: 'simulation_limit',
}

export const POKEMON_CARD_NAMES = {
  type_null: 'Type: Null',
  silvally: 'Silvally',
  glameow: 'Glameow',
  stunky: 'Stunky',
  croagunk: 'Croagunk',
  magneton: 'Magneton',
  heliolisk: 'Heliolisk',
}

export const SUPPORTER_CARD_NAMES = {
  professors_research: "Professor's Research",
  gladion: 'Gladion',
  team_galactic_grunt: 'Team Galactic Grunt',
  traveling_merchant: 'Traveling Merchant',
  may: 'May',
  copycat: 'Copycat',
  lisia: 'Lisia',
  iono: 'Iono',
  serena: 'Serena',
  clemont: 'Clemont',
}

export const NON_SUPPORTER_CARD_NAMES = {
  pokeball: 'Poké Ball',
  clemonts_backpack: "Clemont's Backpack",
  quick_grow_extract: 'Quick-Grow Extract',
}

export const CARD_NAMES = {
  ...POKEMON_CARD_NAMES,
  ...SUPPORTER_CARD_NAMES,
  ...NON_SUPPORTER_CARD_NAMES,
}

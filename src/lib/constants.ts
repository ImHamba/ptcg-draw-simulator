export const VERSION = '1.0'

export const BASIC_STAGE = 'Basic'
export const PROFESSORS_RESEARCH_CARD_NAME = 'Professor’s Research'
export const POKEBALL_CARD_NAME = 'Poké Ball'
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
const CORS_PROXY_URL = 'https://corsproxy.io/?url=' // 'https://api.cors.lol/?url='
export const CARD_DATA_API_URL =
  'https://api.dotgg.gg/cgfw/getcards?game=pokepocket'
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
] as const

export const GENERIC_CARD_TYPES = ['basicOther', 'other'] as const

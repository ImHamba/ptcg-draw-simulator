export const VERSION = '1.0'

export const BASIC_STAGE = 'Basic'
export const PROFESSORS_RESEARCH_CARD_NAME = 'Professor’s Research'
export const POKEBALL_CARD_NAME = 'Poké Ball'
export const MAX_DECK_SIZE = 20
export const FIRST_HAND_SIZE = 6 // includes first draw

// delimiters for share link url
export const COUNT_ID_DELIMITER = '.'
export const CARD_DELIMITER = '_'
export const URL_DECK_SEARCH_PARAM = 'deck'

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

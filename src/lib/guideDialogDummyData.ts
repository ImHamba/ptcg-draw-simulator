// @ts-nocheck
import type { MultiPokeCard, SaveHandDeckState, TargetHands } from './types'
import { omitKeys } from './utils'

export const dummyDeck: MultiPokeCard[] = [
  {
    data: {
      id: 'A3-122',
      set_code: 'A3',
      number: '122',
    },
    count: 2,
  },
  {
    data: {
      id: 'A3-085',
      set_code: 'A3',
      number: '85',
    },
    count: 2,
  },
  {
    data: {
      id: 'A3-086',
      set_code: 'A3',
      number: '86',
    },
    count: 1,
  },
  { cardType: 'basicOther', count: 2 },
  {
    data: {
      id: 'A3-144',
      set_code: 'A3',
      number: '144',
    },
    count: 2,
  },
  {
    data: {
      id: 'PROMO-005',
      set_code: 'PROMO',
      number: '5',
    },
    count: 2,
  },
  {
    data: {
      id: 'PROMO-007',
      set_code: 'PROMO',
      number: '7',
    },
    count: 2,
  },
  { cardType: 'other', count: 7 },
]
export const dummyTargetHands: TargetHands = {
  1: [
    {
      data: {
        id: 'A3-085',
        set_code: 'A3',
        number: '85',
      },
      count: 1,
    },
    {
      data: {
        id: 'A3-144',
        set_code: 'A3',
        number: '144',
      },
      count: 1,
    },
    {
      data: {
        id: 'A3-122',
        set_code: 'A3',
        number: '122',
      },
      count: 1,
    },
  ],
  'f8547961-fc19-4e7e-a676-306361ab6e67': [
    {
      data: {
        id: 'A3-085',
        set_code: 'A3',
        number: '85',
      },
      count: 1,
    },
    {
      data: {
        id: 'A3-086',
        set_code: 'A3',
        number: '86',
      },
      count: 1,
    },
    {
      data: {
        id: 'A3-122',
        set_code: 'A3',
        number: '122',
      },
      count: 1,
    },
  ],
}

export const dummyChartData: Record<string, number>[] = [
  {
    name: '1',
    '819a53b9-b683-465b-95ac-b3a714a7d419': 24.38,
    'cd4e0d57-0684-4f8c-9309-880e538a96e4': 13.56,
    anyMatch: 31.979999999999997,
    cumulative: 31.979999999999997,
  },
  {
    name: '2',
    '819a53b9-b683-465b-95ac-b3a714a7d419': 12.15,
    'cd4e0d57-0684-4f8c-9309-880e538a96e4': 7.04,
    anyMatch: 15.629999999999999,
    cumulative: 47.61,
  },
  {
    name: '3',
    '819a53b9-b683-465b-95ac-b3a714a7d419': 10.040000000000001,
    'cd4e0d57-0684-4f8c-9309-880e538a96e4': 6.239999999999999,
    anyMatch: 12.889999999999999,
    cumulative: 60.5,
  },
  {
    name: '4',
    '819a53b9-b683-465b-95ac-b3a714a7d419': 9.64,
    'cd4e0d57-0684-4f8c-9309-880e538a96e4': 6.279999999999999,
    anyMatch: 11.899999999999999,
    cumulative: 72.4,
  },
  {
    name: '5',
    '819a53b9-b683-465b-95ac-b3a714a7d419': 8.53,
    'cd4e0d57-0684-4f8c-9309-880e538a96e4': 5.88,
    anyMatch: 10.12,
    cumulative: 82.52000000000001,
  },
  {
    name: '6',
    '819a53b9-b683-465b-95ac-b3a714a7d419': 6.36,
    'cd4e0d57-0684-4f8c-9309-880e538a96e4': 4.53,
    anyMatch: 7.1,
    cumulative: 89.62,
  },
  {
    name: '7',
    '819a53b9-b683-465b-95ac-b3a714a7d419': 4.82,
    'cd4e0d57-0684-4f8c-9309-880e538a96e4': 3.9899999999999998,
    anyMatch: 5.28,
    cumulative: 94.9,
  },
  {
    name: '8',
    '819a53b9-b683-465b-95ac-b3a714a7d419': 3.1399999999999997,
    'cd4e0d57-0684-4f8c-9309-880e538a96e4': 2.58,
    anyMatch: 3.2199999999999998,
    cumulative: 98.12,
  },
  {
    name: '9',
    '819a53b9-b683-465b-95ac-b3a714a7d419': 1.37,
    'cd4e0d57-0684-4f8c-9309-880e538a96e4': 1.31,
    anyMatch: 1.4000000000000001,
    cumulative: 99.52000000000001,
  },
  {
    name: '10',
    '819a53b9-b683-465b-95ac-b3a714a7d419': 0.44,
    'cd4e0d57-0684-4f8c-9309-880e538a96e4': 0.41000000000000003,
    anyMatch: 0.44,
    cumulative: 99.96000000000001,
  },
  {
    name: '11',
    '819a53b9-b683-465b-95ac-b3a714a7d419': 0.04,
    'cd4e0d57-0684-4f8c-9309-880e538a96e4': 0.04,
    anyMatch: 0.04,
    cumulative: 100.00000000000001,
  },
]

export const dummyChartDataKeys = Object.keys(
  omitKeys(dummyChartData[0], ['anyMatch', 'name', 'cumulative']),
)

export const dummySaveHandDeckState: SaveHandDeckState =
  (_: () => void, ...__) =>
  () => {}

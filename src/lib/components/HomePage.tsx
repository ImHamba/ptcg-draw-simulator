import { useQuery } from '@tanstack/react-query'

import { useState } from 'react'
import { CARD_DATA_PROXY_URL } from '../cardData'
import {
  type CardData,
  type HandDeckStateChange,
  type MultiPokeCard,
} from '../utils'
import Deck from './Deck'
import Hand from './Hand'
import TargetHands from './TargetHands'

const initialDeck: MultiPokeCard[] = []
const a = [
  {
    name: 'charmander',
    count: 2,
    cardType: 'basicUserDefined',
    data: {
      id: 'A2-184',
      number: '184',
      name: 'Mismagius ex',
      set_code: 'A2',
      set_name: 'abc',
      color: 'Psychic',
      dex: 'A2_2',
      stage: 'Stage 1',
    },
  },
  { count: 2, cardType: 'basicOther' },
  { name: 'candy', count: 2, cardType: 'otherUserDefined' },
  { name: 'charizard', count: 2, cardType: 'otherUserDefined' },
  { name: 'professors Research', count: 2, cardType: 'professorsResearch' },
  { name: 'pokeball', count: 2, cardType: 'pokeball' },
  { cardType: 'other', count: 8 },
]

const initialHand: MultiPokeCard[] = [
  // { name: 'charmander', count: 1, cardType: 'basicUserDefined' },
  // { name: 'candy', count: 2, cardType: 'otherUserDefined' },
  // { name: 'professors Research', count: 1, cardType: 'professorsResearch' },
  // { name: 'pokeball', count: 1, cardType: 'pokeball' },
]

const HomePage = () => {
  // stores current state of deck for hand draw simulation
  const [deck, setDeck] = useState<MultiPokeCard[]>(initialDeck)

  // stores the original state of deck, updated by user adding cards to it
  const [originalDeck, setOriginalDeck] = useState<MultiPokeCard[]>(deck)

  const [hand, setHand] = useState<MultiPokeCard[]>(initialHand)
  const [desiredHand, setDesiredHand] = useState<MultiPokeCard[]>([
    { name: 'charmander', count: 1, cardType: 'basicUserDefined' },
    { name: 'candy', count: 1, cardType: 'otherUserDefined' },
    { name: 'charizard', count: 1, cardType: 'otherUserDefined' },
  ])

  const cardDataQuery = useQuery({
    queryKey: ['cardData'],
    queryFn: async () => {
      return fetch(CARD_DATA_PROXY_URL).then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }

        return res.json()
      })
    },
  })

  console.log(cardDataQuery)

  const cardData: CardData[] = cardDataQuery.data ?? []
  // const { isLoading, error } = cardDataQuery

  // returns a callable that wraps a hand/deck state changing function with state save
  const saveHandDeckState =
    (handDeckStateChangeFn: HandDeckStateChange, ...args: any[]) =>
    () => {
      const {
        newHand,
        newDeck,
        newOriginalDeck,
      } = handDeckStateChangeFn(...args)
      newHand && setHand(newHand)
      newDeck && setDeck(newDeck)
      newOriginalDeck && setOriginalDeck(newOriginalDeck)
    }

  const resetDeckAndHand = () => {
    setDeck(initialDeck)
    setHand(initialHand)
  }

  return (
    <div className="flex-row justify-center p-10">
      <div className="flex-col items-center w-full">
        <div className="w-full row-center gap-10">
          <div className="w-3/5 col-center gap-3">
            <Deck
              deck={deck}
              cardData={cardData}
              saveHandDeckState={saveHandDeckState}
            />
          </div>
          <div className="w-2/5 col-center gap-10">
            <div className="w-full col-center gap-3">
              <Hand
                deck={deck}
                hand={hand}
                resetDeckAndHand={resetDeckAndHand}
                saveHandDeckState={saveHandDeckState}
              />
            </div>
            <div className="w-full col-center gap-3">
              <TargetHands hand={hand} desiredHand={desiredHand} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

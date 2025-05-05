import { useQuery } from '@tanstack/react-query'

import { useState } from 'react'
import { CARD_DATA_PROXY_URL } from '../cardData'
import { initialDeck, initialHand, initialTargetHands } from '../handDeckUtils'
import {
  type CardData,
  type MultiPokeCard,
  type SaveHandDeckState,
} from '../utils'
import Deck from './Deck'
import Hand from './Hand'
import Simulator from './Simulator'
import TargetHandsPanel from './TargetHandsPanel'

const HomePage = () => {
  // stores the original state of deck, updated by user adding cards to it
  const [originalDeck, setOriginalDeck] = useState<MultiPokeCard[]>(initialDeck)

  // stores current state of deck for hand draw simulation
  const [deck, setDeck] = useState<MultiPokeCard[]>(originalDeck)

  const [hand, setHand] = useState<MultiPokeCard[]>(initialHand)
  const [targetHands, setTargetHands] = useState(initialTargetHands)

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

  const cardData: CardData[] = cardDataQuery.data ?? []
  // const { isLoading, error } = cardDataQuery

  // returns a callable that wraps a hand/deck state changing function with state save
  const saveHandDeckState: SaveHandDeckState =
    (handDeckStateChangeFn, ...args) =>
    () => {
      const { newHand, newDeck, newOriginalDeck, newTargetHands } =
        handDeckStateChangeFn(...args)
      newHand && setHand(newHand)
      newDeck && setDeck(newDeck)
      newOriginalDeck && setOriginalDeck(newOriginalDeck)
      newTargetHands && setTargetHands(newTargetHands)
    }

  return (
    <div className="flex-row justify-center p-10 full">
      <div className="flex-col items-center full">
        <div className="full row-center gap-10">
          <div className="w-1/2 h-full col-center gap-10 ">
            <div className="h-1/2 w-full center">
              <Deck
                deck={deck}
                originalDeck={originalDeck}
                cardData={cardData}
                saveHandDeckState={saveHandDeckState}
              />
            </div>
            <div className="h-1/2 w-full">
              <Simulator
                targetHands={targetHands}
                deck={deck}
                originalDeck={originalDeck}
                saveHandDeckState={saveHandDeckState}
              />
            </div>
          </div>

          <div className="w-1/2 h-full col-center gap-10">
            <Hand
              deck={deck}
              originalDeck={originalDeck}
              hand={hand}
              saveHandDeckState={saveHandDeckState}
            />

            <TargetHandsPanel
              hand={hand}
              targetHands={targetHands}
              originalDeck={originalDeck}
              saveHandDeckState={saveHandDeckState}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  decodeDeckCode,
  decodeTargetHandsCode,
  generateEncodedCardsString,
  generateEncodedTargetHandsString,
} from '../appUtils'
import { CARD_DATA_PROXY_URL } from '../cardData'
import {
  CARD_DATA_PROPERTIES,
  DECK_SEARCH_PARAM,
  TARGET_HANDS_SEARCH_PARAM,
} from '../constants'
import { initialDeck, initialHand, initialTargetHands } from '../handDeckUtils'
import {
  pick,
  type CardData,
  type HandDeckStateChange,
  type MultiPokeCard,
  type SaveHandDeckState,
} from '../utils'
import Deck from './Deck'
import Simulator from './Simulator'
import TargetHandsPanel from './TargetHandsPanel'

const SimulatorPage = () => {
  const router = useRouter()
  // stores the original state of deck, updated by user adding cards to it
  const [originalDeck, setOriginalDeck] = useState<MultiPokeCard[]>(initialDeck)

  // stores current state of deck for hand draw simulation
  const [deck, setDeck] = useState<MultiPokeCard[]>(originalDeck)

  const [hand, setHand] = useState<MultiPokeCard[]>(initialHand)
  const [targetHands, setTargetHands] = useState(initialTargetHands)

  // @ts-ignore
  const searchParams: {
    [DECK_SEARCH_PARAM]: string | undefined
    [TARGET_HANDS_SEARCH_PARAM]: string | undefined
  } = useSearch({
    strict: false,
  })
  const deckCode = searchParams[DECK_SEARCH_PARAM]
  const targetHandsCode = searchParams[TARGET_HANDS_SEARCH_PARAM]

  const cardDataQuery = useQuery({
    queryKey: ['query'],
    queryFn: async () => {
      console.log('fetch data')
      return fetch(CARD_DATA_PROXY_URL)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok')
          }

          return res.json()
        })
        .then(async (data: CardData[]) => {
          const properties = CARD_DATA_PROPERTIES.map((x) => x)
          return data.map((card: CardData) => pick(card, properties))
        })
    },
  })

  const cardData: CardData[] = cardDataQuery.data ?? []
  const isCardDataLoading = cardDataQuery.isLoading

  // load state on on mount from url params
  useEffect(() => {
    if (isCardDataLoading) {
      return
    }

    console.log('load url')

    const deck = deckCode ? decodeDeckCode(deckCode, cardData) : null
    const targetHands = targetHandsCode
      ? decodeTargetHandsCode(targetHandsCode, cardData)
      : null

    const stateFn: HandDeckStateChange = () => {
      return {
        ...(deck && {
          newDeck: deck,
          newOriginalDeck: deck,
        }),

        ...(targetHands && { newTargetHands: targetHands }),
      }
    }

    saveHandDeckState(stateFn)()
  }, [deckCode, targetHandsCode, cardData])

  // update url when deck/target hands change
  useEffect(() => {
    // dont update while data is loading so the app has a chance to
    // read the initial url params and load them before overriding them
    if (isCardDataLoading) {
      console.log('skip update url')
      return
    }

    const deckString = generateEncodedCardsString(originalDeck)
    const targetHandsString = targetHands
      ? generateEncodedTargetHandsString(targetHands)
      : null

    const currentSearchParams = new URLSearchParams()
    if (deckString) {
      currentSearchParams.set(DECK_SEARCH_PARAM, deckString)
    }
    if (targetHandsString) {
      currentSearchParams.set(TARGET_HANDS_SEARCH_PARAM, targetHandsString)
    }

    router.navigate({
      to: window.location.pathname,
      search: {
        ...Object.fromEntries(currentSearchParams.entries()),
      },
      replace: true,
    })
  }, [originalDeck, targetHands])

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
    <div className="flex-row justify-center p-3 w-full h-screen">
      <div className="flex-col items-center full">
        <div className="full row-center gap-10">
          <div className="w-1/2 h-full center">
            <Deck
              deck={deck}
              originalDeck={originalDeck}
              cardData={cardData}
              targetHands={targetHands}
              saveHandDeckState={saveHandDeckState}
            />
          </div>

          <div className="w-1/2 h-full col-center gap-10">
            {/* <Hand
              deck={deck}
              originalDeck={originalDeck}
              hand={hand}
              saveHandDeckState={saveHandDeckState}
            /> */}

            <div className="h-1/2 w-full">
              <TargetHandsPanel
                hand={hand}
                targetHands={targetHands}
                originalDeck={originalDeck}
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
        </div>
      </div>
    </div>
  )
}

export default SimulatorPage

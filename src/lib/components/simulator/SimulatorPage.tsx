import type {
  HandDeckStateChange,
  MultiPokeCard,
  SaveHandDeckState,
} from '@/lib/appUtils'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  decodeDeckCode,
  decodeTargetHandsCode,
  generateEncodedCardsString,
  generateEncodedTargetHandsString,
} from '../../appUtils'
import {
  CARD_DATA_PROPERTIES,
  CARD_DATA_PROXY_URL,
  DECK_SEARCH_PARAM,
  TARGET_HANDS_SEARCH_PARAM,
} from '../../constants'
import {
  initialDeck,
  initialHand,
  initialTargetHands,
} from '../../handDeckUtils'
import type { CardData } from '../../utils'
import { pick } from '../../utils'
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
  const [loadedUrlState, setLoadedUrlState] = useState<string | null>(null)

  // @ts-ignore
  const searchParams: {
    [DECK_SEARCH_PARAM]: string | undefined
    [TARGET_HANDS_SEARCH_PARAM]: string | undefined
  } = useSearch({
    strict: false,
  })
  const deckCode = searchParams[DECK_SEARCH_PARAM]
  const targetHandsCode = searchParams[TARGET_HANDS_SEARCH_PARAM]

  // returns a callable that wraps a hand/deck state changing function with state save
  const saveHandDeckState: SaveHandDeckState = useCallback(
    (handDeckStateChangeFn, ...args) =>
      () => {
        const { newHand, newDeck, newOriginalDeck, newTargetHands } =
          handDeckStateChangeFn(...args)
        newHand && setHand(newHand)
        newDeck && setDeck(newDeck)
        newOriginalDeck && setOriginalDeck(newOriginalDeck)
        newTargetHands && setTargetHands(newTargetHands)
      },
    [],
  )

  const cardDataQuery = useQuery({
    queryKey: ['query'],
    queryFn: async () => {
      console.log('fetch data')
      return fetch(CARD_DATA_PROXY_URL).then(async (res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await res.json()
        const properties = CARD_DATA_PROPERTIES.map((x) => x)
        return data.map((card: CardData) => pick(card, properties))
      })
    },
  })

  const cardData: CardData[] = useMemo(
    () => cardDataQuery.data ?? [],
    [cardDataQuery.data],
  )
  const isCardDataLoading = cardDataQuery.isLoading

  // load state on on mount from url params
  useEffect(() => {
    const currentUrlState = `${deckCode ?? ''}|${targetHandsCode ?? ''}`
    if (isCardDataLoading || loadedUrlState) {
      return
    }

    const decodedDeck = deckCode ? decodeDeckCode(deckCode, cardData) : null
    const decodedTargetHands = targetHandsCode
      ? decodeTargetHandsCode(targetHandsCode, cardData)
      : null

    const stateFn: HandDeckStateChange = () => {
      return {
        ...(decodedDeck && {
          newDeck: decodedDeck,
          newOriginalDeck: decodedDeck,
        }),

        ...(decodedTargetHands && { newTargetHands: decodedTargetHands }),
      }
    }

    saveHandDeckState(stateFn)()

    // record the current url state as having been loaded
    setLoadedUrlState(currentUrlState)
  }, [
    deckCode,
    targetHandsCode,
    cardData,
    isCardDataLoading,
    saveHandDeckState,
    loadedUrlState,
  ])

  // update url when deck/target hands change
  useEffect(() => {
    // dont update while data is loading so the app has a chance to
    // read the initial url params and load them before overriding them
    if (isCardDataLoading) {
      return
    }

    const deckString = generateEncodedCardsString(originalDeck)
    const targetHandsString = generateEncodedTargetHandsString(targetHands)

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
      resetScroll: false,
    })
  }, [isCardDataLoading, originalDeck, router, targetHands])

  return (
    <>
      <div className="flex-col ">
        <div className="h-10 top-0 bg-amber-100 z-100">nav</div>
        <div className="row-center gap-20 px-10 pb-10">
          <div className="w-1/2 h-full sticky top-0 pt-5">
            <Deck
              deck={deck}
              originalDeck={originalDeck}
              cardData={cardData}
              targetHands={targetHands}
              saveHandDeckState={saveHandDeckState}
            />
          </div>
          <div className="w-1/2 h-full col-center gap-7 pt-5">
            {/* <Hand
                deck={deck}
                originalDeck={originalDeck}
                hand={hand}
                saveHandDeckState={saveHandDeckState}
              /> */}
            <div className="h-[45vh] w-full">
              <Simulator
                targetHands={targetHands}
                deck={deck}
                originalDeck={originalDeck}
                saveHandDeckState={saveHandDeckState}
              />
            </div>
            <div className="w-full">
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
    </>
  )
}

export default SimulatorPage

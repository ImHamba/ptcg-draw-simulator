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
  isSameCard,
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
import NavBar from '../NavBar'
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

        // if originalDeck wasnt changed, and target hands was, then simply set it
        if (newTargetHands && !newOriginalDeck) {
          setTargetHands(newTargetHands)
        }

        // when originalDeck changes, we want to ensure target hands doesn't end up with a higher
        // count for any cards than are in the deck. We do this here rather than in a useEffect
        // elsewhere to reduce additional rerenders. The cap on target hands car counts is essentially
        // a hard limit enforced at the state saving stage.
        else if (newOriginalDeck) {
          const currentTargetHands = newTargetHands ?? targetHands
          const entries = Object.entries(currentTargetHands)
          console.log(newTargetHands)
          const limitedNewTargetHands: typeof entries = entries.map(
            ([id, targetHand]) => {
              return [
                id,
                targetHand
                  .map((card) => {
                    const deckCard = newOriginalDeck.find((deckCard) =>
                      isSameCard(card, deckCard),
                    )
                    if (!deckCard) {
                      // deck no longer has this card, it should be removed from target hand
                      return null
                    }
                    if (card.count > deckCard.count) {
                      // deck has less of this card, reduce the number in target hand
                      return { ...card, count: deckCard.count }
                    }

                    return card
                  })
                  .filter((x) => x !== null),
              ]
            },
          )
          console.log(Object.fromEntries(limitedNewTargetHands))
          setTargetHands(Object.fromEntries(limitedNewTargetHands))
        }
      },
    [targetHands],
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
        <NavBar cardData={cardData}>
          <div className="h-full flex-row items-center">
            <img src="/public/PTCGP.png" className="h-full p-2" />
          </div>
        </NavBar>
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

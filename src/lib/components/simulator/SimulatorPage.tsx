import type { MultiPokeCard, SaveHandDeckState } from '@/lib/appUtils'
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
import NavBar from '../reuseable/NavBar'
import DeckPanel from './DeckPanel'
import SimulatorPanel from './SimulatorPanel'
import TargetHandsPanel from './TargetHandsPanel'

// solgaleo
// http://localhost:3000/simulator?deck=2.A3-122_2.A3-086_2.A3-144_2.PROMO-005_2.PROMO-007_2.basicOther_2.A3-085&target=1.A3-122_1.A3-144_1.A3-085%7E1.A3-122_1.A3-085_1.A3-086

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
  const urlDeckCode = searchParams[DECK_SEARCH_PARAM]
  const urlTargetHandsCode = searchParams[TARGET_HANDS_SEARCH_PARAM]

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
          let changeMade = false
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
                      changeMade = true
                      return null
                    }
                    if (card.count > deckCard.count) {
                      // deck has less of this card, reduce the number in target hand
                      changeMade = true
                      return { ...card, count: deckCard.count }
                    }

                    return card
                  })
                  .filter((x) => x !== null),
              ]
            },
          )

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (changeMade || newTargetHands) {
            setTargetHands(Object.fromEntries(limitedNewTargetHands))
          }
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
    const currentUrlState = `${urlDeckCode ?? ''}|${urlTargetHandsCode ?? ''}`
    if (isCardDataLoading || loadedUrlState === currentUrlState) {
      return
    }

    const decodedDeck = urlDeckCode
      ? decodeDeckCode(urlDeckCode, cardData)
      : null
    const decodedTargetHands = urlTargetHandsCode
      ? decodeTargetHandsCode(urlTargetHandsCode, cardData)
      : null

    const newState = {
      ...(decodedDeck && {
        newDeck: decodedDeck,
        newOriginalDeck: decodedDeck,
      }),

      ...(decodedTargetHands && { newTargetHands: decodedTargetHands }),
    }

    const stateChangeFn = () => newState

    saveHandDeckState(stateChangeFn)()

    // record the current url state as having been loaded
    setLoadedUrlState(currentUrlState)
  }, [
    urlDeckCode,
    urlTargetHandsCode,
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

    if (
      deckString === urlDeckCode &&
      targetHandsString === urlTargetHandsCode
    ) {
      return
    }

    router.navigate({
      to: window.location.pathname,
      search: {
        ...Object.fromEntries(currentSearchParams.entries()),
      },
      resetScroll: false,
    })
  }, [isCardDataLoading, originalDeck, router, targetHands, urlDeckCode, urlTargetHandsCode])

  return (
    <>
      <div className="flex-col ">
        <NavBar cardData={cardData}>
          <div className="h-full flex-row items-center">
            <img src="PTCGP.png" className="h-full p-2" />
          </div>
        </NavBar>
        <div className="row-center gap-20 px-10 pb-10">
          <div className="w-1/2 h-full sticky top-0 pt-5">
            <DeckPanel
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
              <SimulatorPanel
                targetHands={targetHands}
                originalDeck={originalDeck}
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

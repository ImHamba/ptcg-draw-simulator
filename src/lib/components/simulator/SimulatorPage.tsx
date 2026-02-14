import { useAppStateSearchParamBinding } from '@/lib/hooks/useAppStateSearchParamBinding'
import type { CardData, MultiPokeCard, SaveHandDeckState } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isSameCard } from '../../appUtils'
import { CARD_DATA_PROPERTIES, CARD_DATA_PROXY_URL } from '../../constants'
import { initialDeck, initialTargetHands } from '../../handDeckUtils'
import { pick } from '../../utils'
import NavBar from '../reuseable/navBar/NavBar'
import Separator from '../reuseable/Separator'
import DeckPanel from './DeckPanel'
import SimulatorPanel from './SimulatorPanel'
import TargetHandsPanel from './TargetHandsPanel'

// solgaleo
// http://localhost:3000/simulator?deck=2.A3-122_2.A3-086_2.A3-144_2.PROMO-005_2.PROMO-007_2.basicOther_2.A3-085&target=1.A3-122_1.A3-144_1.A3-085%7E1.A3-122_1.A3-085_1.A3-086

const SimulatorPage = () => {
  // stores the original state of deck, updated by user adding cards to it
  const [originalDeck, setOriginalDeck] = useState<MultiPokeCard[]>(initialDeck)

  const [targetHands, setTargetHands] = useState(initialTargetHands)

  const targetHandsRef = useRef(targetHands)

  // targetHandsRef used for access in saveHandDeckState without it rerendering so
  // it doesnt cause incorrect exeuction of app state/search params two way binding useEffects
  useEffect(() => {
    targetHandsRef.current = targetHands
  }, [targetHands])

  // returns a callable that wraps a hand/deck state changing function with state save
  const saveHandDeckState: SaveHandDeckState = useCallback(
    (handDeckStateChangeFn, ...args) =>
      () => {
        const { newOriginalDeck, newTargetHands } = handDeckStateChangeFn(
          ...args,
        )
        newOriginalDeck && setOriginalDeck(newOriginalDeck)

        // if originalDeck wasnt changed, and target hands was, then simply set it
        if (newTargetHands && !newOriginalDeck) {
          setTargetHands(newTargetHands)
        }

        // when originalDeck changes, we want to ensure target hands doesn't end up with a higher
        // count for any cards than are in the deck. We do this here rather than in a useEffect
        // elsewhere to reduce additional rerenders. The cap on target hands card counts is essentially
        // a hard limit enforced at the state saving stage.
        else if (newOriginalDeck) {
          const currentTargetHands = newTargetHands ?? targetHandsRef.current
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
    [],
  )

  /**
   * Reconstructs compressed data format back to full card data object.
   * Taken from dotgg.gg/api docs
   */
  const reconstructIndexedCardData = (data: any) => {
    return data.data.map((cardArray: any) => {
      return Object.fromEntries(
        data.names.map((fieldName: string, index: number) => [
          fieldName,
          cardArray[index],
        ]),
      )
    })
  }

  const cardDataQuery = useQuery({
    queryKey: ['query'],
    queryFn: async () => {
      console.log('fetch data')
      return fetch(CARD_DATA_PROXY_URL).then(async (res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }

        const indexedData = await res.json()

        const data = reconstructIndexedCardData(indexedData)
        const properties = CARD_DATA_PROPERTIES.map((x) => x)
        return data.map((card: CardData) => pick(card, properties))
      })
    },
  })

  const cardData: CardData[] = useMemo(
    () => cardDataQuery.data ?? [],
    [cardDataQuery.data],
  )

  const isCardDataLoading = useMemo(
    () => cardDataQuery.isLoading,
    [cardDataQuery.isLoading],
  )

  useAppStateSearchParamBinding(
    originalDeck,
    targetHands,
    saveHandDeckState,
    cardData,
    isCardDataLoading,
  )

  return (
    <>
      <div className="flex flex-col ">
        <NavBar cardData={cardData}>
          <div className="h-full flex flex-row items-center">
            <img src="PTCGP.png" className="h-auto max-h-full p-2" />
          </div>
        </NavBar>
        <div className="flex flex-col md:flex-row gap-5 md:gap-10 lg:gap-20 px-5 md:px-10 pb-10">
          <div className="w-full md:w-1/2 h-full md:sticky md:top-0 pt-5">
            <DeckPanel
              originalDeck={originalDeck}
              cardData={cardData}
              targetHands={targetHands}
              saveHandDeckState={saveHandDeckState}
              isCardDataLoading={isCardDataLoading}
            />
          </div>
          <Separator className="md:hidden my-0" />
          <div className="w-full md:w-1/2 h-full col-center gap-7 pt-5">
            {/* <Hand
                deck={deck}
                originalDeck={originalDeck}
                hand={hand}
                saveHandDeckState={saveHandDeckState}
              /> */}
            <div className="h-[65vh] md:h-[45vh] w-full order-2 md:order-1">
              <SimulatorPanel
                targetHands={targetHands}
                originalDeck={originalDeck}
              />
            </div>
            <div className="w-full order-1 md:order-2">
              <TargetHandsPanel
                targetHands={targetHands}
                originalDeck={originalDeck}
                saveHandDeckState={saveHandDeckState}
              />
              <Separator className="md:hidden" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SimulatorPage

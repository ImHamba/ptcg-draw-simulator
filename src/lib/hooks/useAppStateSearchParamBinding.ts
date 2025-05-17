import { useRouter, useSearch } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import {
  decodeDeckCode,
  decodeTargetHandsCode,
  generateEncodedCardsString,
  generateEncodedTargetHandsString,
} from '../appUtils'
import { DECK_SEARCH_PARAM, TARGET_HANDS_SEARCH_PARAM } from '../constants'
import { fillDeck } from '../handDeckUtils'
import type {
  CardData,
  MultiPokeCard,
  SaveHandDeckState,
  TargetHands,
} from '../types'
import { useIsMount } from './hooks'

/**
 * Handles two way binding between app state and
 */
export const useAppStateSearchParamBinding = (
  originalDeck: MultiPokeCard[],
  targetHands: TargetHands,
  saveHandDeckState: SaveHandDeckState,
  cardData: CardData[],
  isCardDataLoading: boolean,
) => {
  const stateRepresentation = useRef('')
  const urlWasUpdatedProgramatically = useRef(false)
  const isMount = useIsMount()
  const router = useRouter()

  // @ts-ignore
  const searchParams: {
    [DECK_SEARCH_PARAM]: string | undefined
    [TARGET_HANDS_SEARCH_PARAM]: string | undefined
  } = useSearch({
    strict: false,
  })
  const urlDeckCode = searchParams[DECK_SEARCH_PARAM]
  const urlTargetHandsCode = searchParams[TARGET_HANDS_SEARCH_PARAM]

  // keep an up to date string representation of current state, accessible by ref so
  // it doesn't cause loops and incorrectly timed useEffects for the
  // two way search param/app state binding
  useEffect(() => {
    const deckString = generateEncodedCardsString(originalDeck)
    const targetHandsString = generateEncodedTargetHandsString(targetHands)
    stateRepresentation.current = `${deckString}|${targetHandsString}`
  }, [originalDeck, stateRepresentation, targetHands])

  // change url -> update state to match
  useEffect(() => {
    const stateRepresentationFromUrl = `${urlDeckCode ?? ''}|${urlTargetHandsCode ?? ''}`

    const skipLoadingState =
      // wait until data is loaded before trying to decode url strings
      isCardDataLoading ||
      // skip if the url would result in the same state that is already present
      stateRepresentation.current === stateRepresentationFromUrl ||
      // skip if the url was just updated by a router.navigate call, we know that url
      // and state match since the url was just set according to new state
      urlWasUpdatedProgramatically.current

    urlWasUpdatedProgramatically.current = false
    if (skipLoadingState) {
      return
    }

    const decodedDeck = urlDeckCode
      ? decodeDeckCode(urlDeckCode, cardData)
      : null
    const decodedTargetHands = urlTargetHandsCode
      ? decodeTargetHandsCode(urlTargetHandsCode, cardData)
      : null

    const newState = {
      ...(decodedDeck
        ? {
            newDeck: decodedDeck,
            newOriginalDeck: decodedDeck,
          }
        : {
            newDeck: fillDeck([]),
            newOriginalDeck: fillDeck([]),
          }),

      ...(decodedTargetHands
        ? { newTargetHands: decodedTargetHands }
        : { newTargetHands: {} }),
    }

    const stateChangeFn = () => newState

    console.log('update state to match url')
    saveHandDeckState(stateChangeFn)()
  }, [
    urlDeckCode,
    urlTargetHandsCode,
    cardData,
    isCardDataLoading,
    saveHandDeckState,
  ])

  // change state -> update url to match
  useEffect(() => {
    const skipUpdatingUrl =
      // wait til card data is loaded
      isCardDataLoading ||
      // dont update url on mount since state will be empty initially and this could cause
      // a url with search params to be overwritten
      isMount

    if (skipUpdatingUrl) {
      return
    }

    const deckString = generateEncodedCardsString(originalDeck)
    const targetHandsString = generateEncodedTargetHandsString(targetHands)

    // dont update url if the url already represents the current app state
    // we use window.location.search so we dont need to use the useSearch values
    // which would cause this useEffect to incorrectly execute when the params change.
    const currentParams = new URLSearchParams(window.location.search)
    if (
      deckString === (currentParams.get(DECK_SEARCH_PARAM) ?? '') &&
      targetHandsString === (currentParams.get(TARGET_HANDS_SEARCH_PARAM) ?? '')
    ) {
      return
    }

    const currentSearchParams = new URLSearchParams()
    if (deckString) {
      currentSearchParams.set(DECK_SEARCH_PARAM, deckString)
    }
    if (targetHandsString) {
      currentSearchParams.set(TARGET_HANDS_SEARCH_PARAM, targetHandsString)
    }

    console.log('update url to match state')
    router.navigate({
      to: window.location.pathname,
      search: {
        ...Object.fromEntries(currentSearchParams.entries()),
      },
      resetScroll: false,
    })

    urlWasUpdatedProgramatically.current = true
  }, [isCardDataLoading, isMount, originalDeck, router, targetHands])
}

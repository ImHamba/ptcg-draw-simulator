import { Button } from '@/components/ui/button'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import {
  generateEncodedDeckString,
  generateShareLink,
  interpretDeckCode,
} from '../appUtils'
import { otherCardFilter } from '../cardFilters'
import { MAX_DECK_SIZE, URL_DECK_SEARCH_PARAM } from '../constants'
import {
  decrementCard,
  fillDeck,
  incrementCard,
  resetAllAndAddCard,
  resetOriginalDeck,
  sumCardCount,
} from '../handDeckUtils'
import { renderCards } from '../reactUtils'
import {
  copyToClipboard,
  not,
  type CardData,
  type MultiPokeCard,
  type PokeCard,
  type SaveHandDeckState,
} from '../utils'
import SearchSelect from './SearchSelect'
import { ShareLinkButton } from './ShareLinkButton'

type Props = {
  deck: MultiPokeCard[]
  originalDeck: MultiPokeCard[]
  cardData: CardData[]
  saveHandDeckState: SaveHandDeckState
}

// greninja
// http://localhost:3000/?deck=2.PROMO-007_2.A2b-111_2.A1-089_2.A1-087_2.A3-144

const Deck = ({ deck, originalDeck, cardData, saveHandDeckState }: Props) => {
  // @ts-ignore
  const searchParams: { [URL_DECK_SEARCH_PARAM]: string } = useSearch({
    strict: false,
  })
  const deckCode = searchParams[URL_DECK_SEARCH_PARAM]
  const router = useRouter()

  // load deck code on mount
  useEffect(() => {
    const deck = interpretDeckCode(deckCode, cardData)

    const stateFn = () => {
      return {
        newDeck: deck,
        newOriginalDeck: deck,
      }
    }

    saveHandDeckState(stateFn)()
    console.log('imported deck')
  }, [deckCode, cardData])

  useEffect(() => {
    const deckString = generateEncodedDeckString(originalDeck)

    const currentSearchParams = new URLSearchParams()
    if (deckString) {
      currentSearchParams.set(URL_DECK_SEARCH_PARAM, deckString)
    }

    console.log(
      'set url deckstring',
      deckString,
      Object.fromEntries(currentSearchParams.entries()),
    )

    router.navigate({
      to: window.location.pathname,
      search: {
        ...Object.fromEntries(currentSearchParams.entries()),
      },
    })
  }, [originalDeck])

  const deckSize = sumCardCount(deck)
  //   const originalDeckSize = sumCardCount(originalDeck)
  const originalDeckWithoutOtherSize = sumCardCount(
    originalDeck,
    not(otherCardFilter),
  )

  const onCardSelect = (cardIndexStr: string) => {
    const cardIndex = parseInt(cardIndexStr)
    const newCardData = cardData[cardIndex]
    const card: PokeCard = {
      data: newCardData,
    }

    saveHandDeckState(resetAllAndAddCard, card, originalDeck)()
  }

  const onAddBasic = () => {
    const card: PokeCard = {
      cardType: 'basicOther',
    }

    return resetAllAndAddCard(card, originalDeck)
  }

  const cardDataOptions = useMemo(
    () =>
      cardData?.map((data, i) => {
        return {
          value: i.toString(),
          label: `${data.name} (${data.id} ${data.set_name})`,
        }
      }),
    [cardData],
  )

  const increment = (card: PokeCard) => {
    console.log('increment', performance.now())
    saveHandDeckState((card) => {
      return {
        newOriginalDeck: fillDeck(incrementCard(originalDeck, card)),
        newDeck: fillDeck(incrementCard(deck, card)),
      }
    }, card)()
  }
  const decrement = (card: PokeCard) =>
    saveHandDeckState((card) => {
      return {
        newOriginalDeck: fillDeck(decrementCard(originalDeck, card)),
        newDeck: fillDeck(decrementCard(deck, card)),
      }
    }, card)()

  const disableIncrement = (card: MultiPokeCard) => {
    // allow many basics but not exceeding deck size
    if (card.cardType === 'basicOther') {
      return originalDeckWithoutOtherSize >= MAX_DECK_SIZE
    }

    // cap other cards at 2
    return card.count >= 2
  }

  // dont show buttons for other cards since theyre automatically populated
  const hideCardButtons = (card: MultiPokeCard) => card.cardType === 'other'

  const onShareLinkClick = () => {
    const link = generateShareLink(originalDeck)
    copyToClipboard(link)
  }

  return (
    <div className="col-center gap-3">
      <div className="text-2xl">Deck ({deckSize})</div>
      <div className="w-full flex-row flex-wrap">
        {renderCards(
          deck,
          6,
          increment,
          decrement,
          disableIncrement,
          hideCardButtons,
        )}
      </div>

      <div className="row-center gap-2">
        <Button onClick={saveHandDeckState(resetOriginalDeck)}>
          Clear Deck
        </Button>

        <Button
          onClick={saveHandDeckState(onAddBasic)}
          disabled={originalDeckWithoutOtherSize >= MAX_DECK_SIZE}
        >
          Add Basic
        </Button>

        <ShareLinkButton
          onShareLinkClick={onShareLinkClick}
          disabled={originalDeckWithoutOtherSize >= MAX_DECK_SIZE}
        />
      </div>
      <SearchSelect
        options={cardDataOptions}
        className="mb-0 w-100 border-black border-2"
        onSelect={onCardSelect}
      />
    </div>
  )
}

export default Deck

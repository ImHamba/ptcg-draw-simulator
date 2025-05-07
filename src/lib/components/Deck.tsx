import { Button } from '@/components/ui/button'
import { otherCardFilter } from '../cardFilters'
import { MAX_DECK_SIZE } from '../constants'
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
  not,
  type CardData,
  type MultiPokeCard,
  type PokeCard,
  type SaveHandDeckState,
} from '../utils'
import SearchSelect from './SearchSelect'

type Props = {
  deck: MultiPokeCard[]
  originalDeck: MultiPokeCard[]
  cardData: CardData[]
  saveHandDeckState: SaveHandDeckState
}

const Deck = ({ deck, originalDeck, cardData, saveHandDeckState }: Props) => {
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

  const addBasic = () => {
    const card: PokeCard = {
      cardType: 'basicOther',
    }

    return resetAllAndAddCard(card, originalDeck)
  }

  const cardDataOptions = cardData?.map((data, i) => {
    return {
      value: i.toString(),
      label: `${data.name} (${data.id} ${data.set_name})`,
    }
  })

  // const decrementCardFromDeck = (card: PokeCard) => {
  //   decreme
  // }

  const increment = (card: PokeCard) =>
    saveHandDeckState((card) => {
      return {
        newOriginalDeck: fillDeck(incrementCard(originalDeck, card)),
        newDeck: fillDeck(incrementCard(deck, card)),
      }
    }, card)()
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
          onClick={saveHandDeckState(addBasic)}
          disabled={originalDeckWithoutOtherSize >= MAX_DECK_SIZE}
        >
          Add Basic
        </Button>
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

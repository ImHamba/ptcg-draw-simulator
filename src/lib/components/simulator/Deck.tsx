import { Button } from '@/components/ui/button'
import type {
  MultiPokeCard,
  PokeCard,
  SaveHandDeckState,
  TargetHands,
} from '@/lib/appUtils'
import { useCallback, useMemo } from 'react'
import { generateShareLink } from '../../appUtils'
import { otherCardFilter } from '../../cardFilters'
import { MAX_DECK_SIZE } from '../../constants'
import {
  decrementCard,
  fillDeck,
  incrementCard,
  resetAllAndAddCard,
  resetOriginalDeck,
  sumCardCount,
} from '../../handDeckUtils'
import type { CardData } from '../../utils'
import { copyToClipboard, not } from '../../utils'
import PokeCardDisplay from './PokeCardDisplay'
import PokeCardsContainer from './PokeCardsContainer'
import SearchSelect from './SearchSelect'
import { ShareLinkButton } from './ShareLinkButton'

type Props = {
  deck: MultiPokeCard[]
  originalDeck: MultiPokeCard[]
  cardData: CardData[]
  targetHands: TargetHands
  saveHandDeckState: SaveHandDeckState
}

// greninja
// http://localhost:3000/?deck=2.PROMO-007_2.A2b-111_2.A1-089_2.A1-087_2.A3-144_2.A3-009_2.A3-012_1.A3-011_1.A1-088&target=1.A1-089_1.A1-087_1.A3-144
// http://localhost:3000/simulator?deck=2.A2a-071_2.A2b-111_2.PROMO-007_2.A2a-050_2.A1-172_2.A2a-009_2.A3-144&target=1.A2a-071_1.A2a-009%7E1.A2a-050_1.A1-172_1.A2a-071_1.A3-144
const Deck = ({
  deck,
  originalDeck,
  cardData,
  targetHands,
  saveHandDeckState,
}: Props) => {
  const originalDeckWithoutOtherSize = sumCardCount(
    originalDeck,
    not(otherCardFilter),
  )

  const onCardSelect = useCallback(
    (cardIndexStr: string) => {
      const cardIndex = parseInt(cardIndexStr)
      const newCardData = cardData[cardIndex]
      const card: PokeCard = {
        data: newCardData,
      }

      saveHandDeckState(resetAllAndAddCard, card, originalDeck)()
    },
    [cardData, originalDeck, saveHandDeckState],
  )

  const onAddBasic = () => {
    const card: PokeCard = {
      cardType: 'basicOther',
    }

    return resetAllAndAddCard(card, originalDeck)
  }

  const cardDataOptions = useMemo(
    () =>
      cardData.map((data, i) => {
        return {
          value: i.toString(),
          label: `${data.name} (${data.id} ${data.set_name})`,
        }
      }),
    [cardData],
  )

  const increment = useCallback(
    (card: PokeCard) => {
      saveHandDeckState((card) => {
        return {
          newOriginalDeck: fillDeck(incrementCard(originalDeck, card)),
          newDeck: fillDeck(incrementCard(deck, card)),
        }
      }, card)()
    },
    [deck, originalDeck, saveHandDeckState],
  )

  const decrement = useCallback(
    (card: PokeCard) =>
      saveHandDeckState((card) => {
        return {
          newOriginalDeck: fillDeck(decrementCard(originalDeck, card)),
          newDeck: fillDeck(decrementCard(deck, card)),
        }
      }, card)(),
    [deck, originalDeck, saveHandDeckState],
  )

  const onShareLinkClick = () => {
    const link = generateShareLink(originalDeck, targetHands)
    copyToClipboard(link)
  }

  return (
    <div className="col-center gap-3 full">
      <div className="text-2xl">Deck Builder</div>
      <div className="row-center gap-2">
        <Button
          onClick={saveHandDeckState(onAddBasic)}
          disabled={originalDeckWithoutOtherSize >= MAX_DECK_SIZE}
        >
          Add Generic Basic
        </Button>

        <ShareLinkButton
          onShareLinkClick={onShareLinkClick}
          disabled={originalDeckWithoutOtherSize >= MAX_DECK_SIZE}
        />

        <Button
          className="bg-red-800"
          onClick={saveHandDeckState(resetOriginalDeck)}
        >
          Clear Deck
        </Button>
      </div>
      <SearchSelect
        options={cardDataOptions}
        className="mb-0 w-100"
        onSelect={onCardSelect}
      />
      <div className="grow full">
        <div className="w-full">
          <PokeCardsContainer width={6}>
            {deck.map((card) => {
              const disableIncrement =
                // allow many basics but not exceeding deck size
                // cap other cards at 2
                card.cardType === 'basicOther'
                  ? originalDeckWithoutOtherSize >= MAX_DECK_SIZE
                  : card.count >= 2

              return (
                <PokeCardDisplay
                  key={card.data?.id ?? card.cardType}
                  card={card}
                  incrementCard={increment}
                  decrementCard={decrement}
                  disableIncrement={disableIncrement}
                  // dont show buttons for Other cards since theyre automatically populated
                  hideButtons={card.cardType === 'other'}
                />
              )
            })}
          </PokeCardsContainer>
        </div>
      </div>
    </div>
  )
}

export default Deck

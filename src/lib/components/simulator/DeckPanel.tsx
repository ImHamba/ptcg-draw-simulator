import { Button } from '@/components/ui/button'
import { atLeast, useScreenSize } from '@/lib/hooks/useScreenSize'
import type {
  CardData,
  MultiPokeCard,
  PokeCard,
  SaveHandDeckState,
  TargetHands,
} from '@/lib/types'
import { useRouter } from '@tanstack/react-router'
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
import { copyToClipboard, not } from '../../utils'
import PokeCardDisplay from '../reuseable/PokeCardDisplay'
import PokeCardsContainer from '../reuseable/PokeCardsContainer'
import SearchSelect from '../reuseable/SearchSelect'
import { ShareLinkButton } from '../reuseable/ShareLinkButton'

type Props = {
  deck: MultiPokeCard[]
  originalDeck: MultiPokeCard[]
  cardData: CardData[]
  targetHands: TargetHands
  saveHandDeckState: SaveHandDeckState
  guideDisplay?: boolean // for customised display in the user guide
}

// greninja
// http://localhost:3000/?deck=2.PROMO-007_2.A2b-111_2.A1-089_2.A1-087_2.A3-144_2.A3-009_2.A3-012_1.A3-011_1.A1-088&target=1.A1-089_1.A1-087_1.A3-144
// http://localhost:3000/simulator?deck=2.A2a-071_2.A2b-111_2.PROMO-007_2.A2a-050_2.A1-172_2.A2a-009_2.A3-144&target=1.A2a-071_1.A2a-009%7E1.A2a-050_1.A1-172_1.A2a-071_1.A3-144
const DeckPanel = ({
  deck,
  originalDeck,
  cardData,
  targetHands,
  saveHandDeckState,
  guideDisplay = false,
}: Props) => {
  const router = useRouter()
  const screenSize = useScreenSize()

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
    const link = generateShareLink(originalDeck, targetHands, false, router)
    copyToClipboard(link)
  }

  const deckCardsContainerWidth = useMemo(
    () =>
      atLeast(screenSize, 'xl')
        ? 6
        : atLeast(screenSize, 'lg')
          ? 5
          : atLeast(screenSize, 'md')
            ? 4
            : atLeast(screenSize, 'sm')
              ? 5
              : 4,
    [screenSize],
  )

  return (
    <div className="col-center gap-3 full">
      {!guideDisplay && <div className="text-2xl">Deck Builder</div>}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={saveHandDeckState(onAddBasic)}
          disabled={
            originalDeckWithoutOtherSize >= MAX_DECK_SIZE || guideDisplay
          }
        >
          Add Generic Basic
        </Button>

        <Button
          variant="destructive"
          onClick={saveHandDeckState(resetOriginalDeck)}
          disabled={guideDisplay}
        >
          Clear Deck
        </Button>

        <ShareLinkButton
          onShareLinkClick={onShareLinkClick}
          disabled={guideDisplay}
        />
      </div>

      {!guideDisplay && (
        <SearchSelect
          options={cardDataOptions}
          className="mb-0 w-100 max-w-full min-w-0"
          onSelect={onCardSelect}
        />
      )}

      <div className="grow full">
        <div className="w-full">
          <PokeCardsContainer width={deckCardsContainerWidth}>
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

export default DeckPanel

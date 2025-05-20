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
import { Loader2Icon } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { generateShareLink } from '../../appUtils'
import { otherCardFilter } from '../../cardFilters'
import {
  MAX_COUNT_PER_CARD_NAME,
  MAX_DECK_SIZE,
  POKEBALL_CARD_NAME,
  PROFESSORS_RESEARCH_CARD_NAME,
} from '../../constants'
import {
  decrementCard,
  fillDeck,
  incrementCard,
  resetAllAndAddCard,
  resetOriginalDeck,
  sameNameCardsCount,
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
  isCardDataLoading: boolean
}

// http://localhost:3000/simulator?deck=2.A2a-071_2.A2b-111_2.PROMO-007_2.A2a-050_2.A1-172_2.A2a-009_2.A3-144&target=1.A2a-071_1.A2a-009%7E1.A2a-050_1.A1-172_1.A2a-071_1.A3-144
const DeckPanel = ({
  deck,
  originalDeck,
  cardData,
  targetHands,
  saveHandDeckState,
  guideDisplay = false,
  isCardDataLoading,
}: Props) => {
  const router = useRouter()
  const screenSize = useScreenSize()

  const originalDeckWithoutOtherSize = useMemo(
    () => sumCardCount(originalDeck, not(otherCardFilter)),
    [originalDeck],
  )

  const onCardSelect = useCallback(
    (cardIndexStr: string) => {
      const cardIndex = parseInt(cardIndexStr)
      const newCardData = cardData[cardIndex]
      const card: PokeCard = {
        data: newCardData,
      }

      // cancel operation if the deck already has 2 same named cards
      if (sameNameCardsCount(card, originalDeck) >= 2) {
        return
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

  const add2cardToDeckFn = useCallback(
    (card: PokeCard) => () => {
      const count = Math.min(
        2,
        MAX_COUNT_PER_CARD_NAME - sameNameCardsCount(card, originalDeck),
        MAX_DECK_SIZE - originalDeckWithoutOtherSize,
      )
      return resetAllAndAddCard(card, originalDeck, count)
    },
    [originalDeck, originalDeckWithoutOtherSize],
  )

  const promoPokeBall: PokeCard | undefined = useMemo(() => {
    const data = cardData.find(
      (cardData) =>
        cardData.name === POKEBALL_CARD_NAME && cardData.set_name === 'Promo A',
    )
    if (!data) {
      return undefined
    }
    return {
      data: data,
    }
  }, [cardData])

  const promoProfResearch: PokeCard | undefined = useMemo(() => {
    const data = cardData.find(
      (cardData) =>
        cardData.name === PROFESSORS_RESEARCH_CARD_NAME &&
        cardData.set_name === 'Promo A',
    )
    if (!data) {
      return undefined
    }
    return {
      data: data,
    }
  }, [cardData])

  return (
    <div className="col-center gap-3 full">
      {!guideDisplay && <div className="text-2xl">Deck Builder</div>}
      {isCardDataLoading ? (
        <div className="row-center items-center gap-2">
          <div className="relative size-7">
            <Loader2Icon
              className="absolute animate-spin text-[#3466AF] full font-bold"
              strokeWidth={6}
            />
            <Loader2Icon
              className="absolute animate-spin text-[#FFCB05] full font-bold"
              strokeWidth={3}
            />
          </div>
          <div>Card data loading...</div>
        </div>
      ) : (
        <>
          <div className="row-center flex-wrap gap-2">
            <Button
              onClick={saveHandDeckState(onAddBasic)}
              disabled={
                originalDeckWithoutOtherSize >= MAX_DECK_SIZE || guideDisplay
              }
            >
              +1 Generic Basic
            </Button>
            <Button
              onClick={
                promoPokeBall
                  ? saveHandDeckState(add2cardToDeckFn(promoPokeBall))
                  : undefined
              }
              disabled={
                originalDeckWithoutOtherSize >= MAX_DECK_SIZE ||
                (promoPokeBall &&
                  sameNameCardsCount(promoPokeBall, originalDeck) >= 2) ||
                guideDisplay
              }
            >
              +2 Poke Ball
            </Button>
            <Button
              onClick={
                promoProfResearch
                  ? saveHandDeckState(add2cardToDeckFn(promoProfResearch))
                  : undefined
              }
              disabled={
                originalDeckWithoutOtherSize >= MAX_DECK_SIZE ||
                (promoProfResearch &&
                  sameNameCardsCount(promoProfResearch, originalDeck) >= 2) ||
                guideDisplay
              }
            >
              +2 Professor's Research
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
        </>
      )}

      <div className="grow full">
        <div className="w-full">
          <PokeCardsContainer width={deckCardsContainerWidth}>
            {deck.map((card) => {
              const disableIncrement =
                // everything disabled if deck at max capacity
                originalDeckWithoutOtherSize >= MAX_DECK_SIZE
                  ? true
                  : // allow many basics but not exceeding deck size
                    card.cardType === 'basicOther'
                    ? false
                    : // cap other cards at 2
                      sameNameCardsCount(card, originalDeck) >=
                      MAX_COUNT_PER_CARD_NAME

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

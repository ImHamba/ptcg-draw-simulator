import { Button } from '@/components/ui/button'
import { isSameCard } from '@/lib/appUtils'
import { atLeast, useScreenSize } from '@/lib/hooks/useScreenSize'
import type {
  HandDeckStateChanger,
  MultiPokeCard,
  PokeCard,
  SaveHandDeckState,
  TargetHands,
} from '@/lib/types'
import { Trash2 } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  addTargetCard,
  decrementCard,
  incrementCard,
} from '../../handDeckUtils'
import PokeCardDisplay from '../reuseable/PokeCardDisplay'
import PokeCardsContainer from '../reuseable/PokeCardsContainer'
import SearchSelect from '../reuseable/SearchSelect'

type Props = {
  targetHandId: string | null
  targetHands: TargetHands
  originalDeck: MultiPokeCard[]
  saveHandDeckState: SaveHandDeckState
  guideDisplay?: boolean // for customised display in the user guide
}

const TargetHand = ({
  targetHandId,
  targetHands,
  originalDeck,
  saveHandDeckState,
  guideDisplay = false,
}: Props) => {
  const screenSize = useScreenSize()

  const targetHand = useMemo(
    () => (targetHandId ? targetHands[targetHandId] : []),
    [targetHandId, targetHands],
  )

  const options = originalDeck
    .map((card, i) => {
      return { ...card, ind: i }
    })
    .filter(
      (deckCard) =>
        !targetHand.some(
          (targetCard) =>
            isSameCard(targetCard, deckCard) &&
            targetCard.count >= deckCard.count,
        ),
    )
    .map((card) => {
      const label = card.data
        ? `${card.data.name} (${card.data.id} ${card.data.set_name})`
        : card.cardType === 'other'
          ? 'Other Card'
          : 'Basic Pokemon'

      return {
        value: card.ind.toString(),
        label: label,
      }
    })

  const onCardSelect = (cardIndexStr: string) => {
    const cardIndex = parseInt(cardIndexStr)
    const card = originalDeck[cardIndex]

    // either add it to current target hand id or if it doesnt exist yet, generate a random one
    const addToTargetHandId = targetHandId ?? uuidv4()

    saveHandDeckState(addTargetCard, card, addToTargetHandId, targetHands)()
  }

  const increment = useCallback(
    (card: PokeCard) => {
      if (!targetHandId) {
        return {}
      }

      return {
        newTargetHands: {
          ...targetHands,
          [targetHandId]: incrementCard(targetHand, card),
        },
      }
    },
    [targetHand, targetHandId, targetHands],
  )

  const decrement = useCallback(
    (card: PokeCard) => {
      if (!targetHandId) {
        return {}
      }

      return {
        newTargetHands: {
          ...targetHands,
          [targetHandId]: decrementCard(targetHand, card),
        },
      }
    },
    [targetHand, targetHandId, targetHands],
  )

  const clear: HandDeckStateChanger = useCallback(() => {
    return {
      newTargetHands: Object.fromEntries(
        Object.entries(targetHands).filter(([id, _]) => id !== targetHandId),
      ),
    }
  }, [targetHandId, targetHands])

  const duplicate: HandDeckStateChanger = useCallback(() => {
    return {
      newTargetHands: { ...targetHands, [uuidv4()]: targetHand },
    }
  }, [targetHand, targetHands])

  const targetHandCardContainerWidth = useMemo(
    () => (atLeast(screenSize, 'md') ? 5 : 4),
    [screenSize],
  )

  return (
    <div>
      <div className="w-full flex flex-col lg:flex-row lg:gap-5">
        <div className="w-full lg:w-3/5">
          {!targetHandId ? (
            <div className="text-xl ms-3">Create new target hand</div>
          ) : (
            <PokeCardsContainer width={targetHandCardContainerWidth}>
              {targetHand.map((card) => {
                return (
                  <PokeCardDisplay
                    key={card.data?.id ?? card.cardType}
                    card={card}
                    incrementCard={saveHandDeckState(increment, card)}
                    decrementCard={saveHandDeckState(decrement, card)}
                    disableIncrement={
                      card.count >=
                      (originalDeck.find((deckCard) =>
                        isSameCard(deckCard, card),
                      )?.count ?? 0)
                    }
                  />
                )
              })}
            </PokeCardsContainer>
          )}
        </div>
        <div className="flex flex-row items-center lg:flex-col lg:items-end w-full lg:w-2/5 mt-2 gap-2 lg:gap-0">
          <SearchSelect
            options={options}
            className="w-full"
            onSelect={onCardSelect}
            disabled={guideDisplay}
          />
          {targetHandId && (
            <div className="lg:mt-2 flex flex-row gap-2 justify-end">
              <Button
                variant="outline"
                onClick={saveHandDeckState(duplicate)}
                disabled={guideDisplay}
              >
                Duplicate
              </Button>
              <Button
                className="aspect-square !p-0"
                onClick={saveHandDeckState(clear)}
                variant="destructive"
                disabled={guideDisplay}
              >
                <Trash2 className="size-4/7" />
                {/* <i className="fa-solid fa-trash" /> */}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TargetHand

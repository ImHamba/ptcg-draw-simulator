import { Button } from '@/components/ui/button'
import type {
  HandDeckStateChange,
  MultiPokeCard,
  PokeCard,
  SaveHandDeckState,
  TargetHands,
} from '@/lib/appUtils'
import { isSameCard } from '@/lib/appUtils'
import { useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  addTargetCard,
  decrementCard,
  incrementCard,
} from '../../handDeckUtils'
import PokeCardDisplay from './PokeCardDisplay'
import PokeCardsContainer from './PokeCardsContainer'
import SearchSelect from './SearchSelect'

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

  const clear: HandDeckStateChange = useCallback(() => {
    return {
      newTargetHands: Object.fromEntries(
        Object.entries(targetHands).filter(([id, _]) => id !== targetHandId),
      ),
    }
  }, [targetHandId, targetHands])

  const duplicate: HandDeckStateChange = useCallback(() => {
    return {
      newTargetHands: { ...targetHands, [uuidv4()]: targetHand },
    }
  }, [targetHand, targetHands])

  return (
    <div className={`pb-5 ${targetHandId && 'border-b-2'}`}>
      <div className="w-full flex-row gap-5">
        <div className="w-3/5">
          {!targetHandId ? (
            <div className="text-xl ms-3">Create new target hand</div>
          ) : (
            <PokeCardsContainer width={Math.max(4, targetHand.length)}>
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
        <div className="flex-col w-2/5 mt-2">
          <SearchSelect
            options={options}
            className="w-full"
            onSelect={onCardSelect}
            disabled={guideDisplay}
          />
          {targetHandId && (
            <div className="mt-2 flex-row gap-2 justify-end">
              <Button
                className=""
                onClick={saveHandDeckState(duplicate)}
                disabled={guideDisplay}
              >
                Duplicate
              </Button>
              <Button
                className="aspect-square p-0"
                onClick={saveHandDeckState(clear)}
                variant="destructive"
                disabled={guideDisplay}
              >
                <i className="fa-solid fa-trash" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TargetHand

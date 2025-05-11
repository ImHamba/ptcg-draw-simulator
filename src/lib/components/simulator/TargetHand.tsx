import type {
  MultiPokeCard,
  PokeCard,
  SaveHandDeckState,
  TargetHands,
} from '@/lib/appUtils'
import { checkHandMatchesTargetHand, isSameCard } from '@/lib/appUtils'
import { useMemo } from 'react'
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
  hand: MultiPokeCard[]
  originalDeck: MultiPokeCard[]
  saveHandDeckState: SaveHandDeckState
}

const TargetHand = ({
  targetHandId,
  hand,
  targetHands,
  originalDeck,
  saveHandDeckState,
}: Props) => {
  const targetHand = useMemo(
    () => (targetHandId ? targetHands[targetHandId] : []),
    [targetHandId, targetHands],
  )

  const handMatchesTarget = checkHandMatchesTargetHand(hand, targetHand)

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

  const increment = useMemo(() => {
    return !targetHandId
      ? null
      : (card: PokeCard) => {
          targetHand
          saveHandDeckState((card) => {
            return {
              newTargetHands: {
                ...targetHands,
                [targetHandId]: incrementCard(targetHand, card),
              },
            }
          }, card)()
        }
  }, [saveHandDeckState, targetHand, targetHandId, targetHands])

  const decrement = useMemo(() => {
    return !targetHandId
      ? null
      : (card: PokeCard) => {
          saveHandDeckState((card) => {
            return {
              newTargetHands: {
                ...targetHands,
                [targetHandId]: decrementCard(targetHand, card),
              },
            }
          }, card)()
        }
  }, [saveHandDeckState, targetHand, targetHandId, targetHands])

  return (
    <div className="pb-5 border-b-2">
      {!targetHandId && <div className="text-xl mb-2">Add new target hand</div>}
      <div className="w-full flex-row flex-wrap ">
        <PokeCardsContainer width={Math.max(8, targetHand.length)}>
          {targetHand.map((card) => {
            return (
              <PokeCardDisplay
                key={card.data?.id ?? card.cardType}
                card={card}
                incrementCard={increment ?? undefined}
                decrementCard={decrement ?? undefined}
                disableIncrement={
                  card.count >=
                  (originalDeck.find((deckCard) => isSameCard(deckCard, card))
                    ?.count ?? 0)
                }
              />
            )
          })}
        </PokeCardsContainer>
      </div>
      {targetHandId && (
        <div className={handMatchesTarget ? 'text-green-300' : 'text-red-400'}>
          {handMatchesTarget ? 'Matching!' : 'Not Matching'}
        </div>
      )}

      {targetHandId ?? 'null'}
      <SearchSelect
        options={options}
        className="w-100"
        onSelect={onCardSelect}
      />
    </div>
  )
}

export default TargetHand

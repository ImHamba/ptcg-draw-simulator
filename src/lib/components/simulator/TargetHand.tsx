import {
  checkHandMatchesTargetHand,
  isSameCard,
  type MultiPokeCard,
  type PokeCard,
  type SaveHandDeckState,
  type TargetHands,
} from '@/lib/appUtils'
import { v4 as uuidv4 } from 'uuid'
import {
  addTargetCard,
  decrementCard,
  incrementCard,
} from '../../handDeckUtils'
import { renderCards } from '../../reactUtils'
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
  const targetHand = targetHandId ? targetHands[targetHandId] : []

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
        ? `${card.data?.name} (${card.data?.id} ${card.data?.set_name})`
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

  const increment = !targetHandId
    ? null
    : (card: PokeCard) => {
        saveHandDeckState((card) => {
          return {
            newTargetHands: {
              ...targetHands,
              [targetHandId]: incrementCard(targetHand, card),
            },
          }
        }, card)()
      }

  const decrement = !targetHandId
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

  const disableIncrement = (card: MultiPokeCard) =>
    card.count >=
    (originalDeck.find((deckCard) => isSameCard(deckCard, card))?.count ?? 0)

  return (
    <div className="pb-5 border-b-2">
      {!targetHandId && <div className="text-xl mb-2">Add new target hand</div>}
      <div className="w-full flex-row flex-wrap ">
        {renderCards(
          targetHand,
          Math.max(8, targetHand.length),
          increment,
          decrement,
          disableIncrement,
        )}
      </div>
      {targetHandId && (
        <div className={handMatchesTarget ? 'text-green-300' : 'text-red-400'}>
          {handMatchesTarget ? 'Matching!' : 'Not Matching'}
        </div>
      )}
      <SearchSelect
        options={options}
        className="w-100"
        onSelect={onCardSelect}
      />
    </div>
  )
}

export default TargetHand

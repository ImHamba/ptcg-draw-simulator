import { addTargetCard } from '../handDeckUtils'
import { renderCards } from '../reactUtils'
import {
  checkHandMatchesTargetHand,
  isSameCard,
  type MultiPokeCard,
  type SaveHandDeckState,
} from '../utils'
import SearchSelect from './SearchSelect'

type Props = {
  targetHand: MultiPokeCard[]
  hand: MultiPokeCard[]
  originalDeck: MultiPokeCard[]
  saveHandDeckState: SaveHandDeckState
}

const TargetHands = ({
  hand,
  targetHand,
  originalDeck,
  saveHandDeckState,
}: Props) => {
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

    console.log('add')
    saveHandDeckState(addTargetCard, card, targetHand)()
  }

  return (
    <>
      <div className="text-2xl">Target Hands</div>
      <div className={handMatchesTarget ? 'text-green-300' : 'text-red-400'}>
        {handMatchesTarget ? 'Matching!' : 'Not Matching'}
      </div>
      <SearchSelect
        options={options}
        className="w-100 border-black border-2"
        onSelect={onCardSelect}
      />
      <div className="w-full flex-row flex-wrap">{renderCards(targetHand)}</div>
    </>
  )
}

export default TargetHands

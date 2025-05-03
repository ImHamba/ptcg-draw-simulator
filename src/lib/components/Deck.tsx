import { addCardToDeck, sumCardCount } from '../handDeckUtils'
import { renderCards } from '../reactUtils'
import {
  type CardData,
  type HandDeckStateChange,
  type MultiPokeCard,
} from '../utils'
import SearchSelect from './SearchSelect'

type Props = {
  deck: MultiPokeCard[]
  cardData: CardData[]
  saveHandDeckState: (
    handDeckStateChangeFn: HandDeckStateChange,
    ...args: any[]
  ) => () => void
}
const Deck = ({ deck, cardData, saveHandDeckState }: Props) => {
  const deckSize = sumCardCount(deck)

  const onCardSelect = (cardIndexStr: string) => {
    const cardIndex = parseInt(cardIndexStr)
    const newCardData = cardData[cardIndex]
    const card: MultiPokeCard = {
      count: 1,
      cardType: 'other',
      data: newCardData,
    }

    console.log(card.data)

    saveHandDeckState(addCardToDeck, card, deck)()
  }

  const cardDataOptions = cardData?.map((data, i) => {
    return {
      value: i.toString(),
      label: `${data.name} (${data.id} ${data.set_name})`,
    }
  })

  return (
    <>
      <div className="text-2xl">Deck ({deckSize})</div>
      <div className="w-full flex-row flex-wrap">{renderCards(deck, 6)}</div>
      <SearchSelect
        options={cardDataOptions}
        className="w-100 border-black border-2"
        onSelect={onCardSelect}
      />
    </>
  )
}

export default Deck

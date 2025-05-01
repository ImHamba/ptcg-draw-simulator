import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import {
  getRandomInt,
  isSameCard,
  sumCardCount,
  type Card,
  type MultiCard,
} from '../utils'

type MultiCardWithCumuCount = MultiCard & { cumuCount: number }

const HomePage = () => {
  const [deck, setDeck] = useState<MultiCard[]>([
    { name: 'charmander', count: 1, cardType: 'basicUserDefined' },
    { count: 1, cardType: 'basicOther' },
    { name: 'candy', count: 2, cardType: 'otherUserDefined' },
    { name: 'charizard', count: 2, cardType: 'otherUserDefined' },
    { name: 'professorsResearch', count: 1, cardType: 'professorsResearch' },
    { name: 'pokeball', count: 1, cardType: 'pokeball' },
  ])

  useEffect(() => {
    setDeck([...deck, { cardType: 'other', count: 20 - sumCardCount(deck) }])
  }, [])

  const [hand, setHand] = useState<MultiCard[]>([
    { name: 'charmander', count: 1, cardType: 'basicUserDefined' },
    { name: 'candy', count: 2, cardType: 'otherUserDefined' },
    { name: 'professorsResearch', count: 1, cardType: 'professorsResearch' },
    { name: 'pokeball', count: 1, cardType: 'pokeball' },
  ])

  const [desiredHand, setDesiredHand] = useState<MultiCard[]>([
    { name: 'charmander', count: 1, cardType: 'basicUserDefined' },
    { name: 'candy', count: 1, cardType: 'otherUserDefined' },
    { name: 'charizard', count: 1, cardType: 'otherUserDefined' },
  ])

  const drawFromDeck = (hand: MultiCard[], deck: MultiCard[]) => {
    // pick a random number within the size of the deck
    const deckSize = sumCardCount(deck)
    const drawIndex = getRandomInt(deckSize)

    // calculate cumulative counts of cards through the deck
    const deckWithCumuCounts = deck.reduce((acc, item) => {
      console.log('cnt', item.count)
      return [
        ...acc,
        { ...item, cumuCount: (acc.at(-1)?.cumuCount ?? 0) + item.count },
      ]
    }, [] as MultiCardWithCumuCount[])

    // extract the card corresponding to the draw index and decrement the count of that card
    const { drawnCard, newDeck } = deckWithCumuCounts.reduce(
      (acc, item) => {
        console.log(
          acc.newDeck.at(-1)?.cumuCount ?? 0,
          drawIndex,
          item.cumuCount,
          acc.drawnCard === null &&
            (acc.newDeck.at(-1)?.cumuCount ?? 0) <= drawIndex &&
            drawIndex < item.cumuCount,
        )
        if (
          acc.drawnCard === null &&
          (acc.newDeck.at(-1)?.cumuCount ?? 0) <= drawIndex &&
          drawIndex < item.cumuCount
        ) {
          return {
            drawnCard: item,
            newDeck: [...acc.newDeck, { ...item, count: item.count - 1 }],
          }
        }

        return { drawnCard: acc.drawnCard, newDeck: [...acc.newDeck, item] }
      },
      {
        drawnCard: null as Card | null,
        newDeck: [] as MultiCardWithCumuCount[],
      },
    )

    if (!drawnCard) {
      throw Error(
        `Error drawing card from deck:\ndraw index: ${drawIndex}\ndeck: ${JSON.stringify(deck, null, 2)}`,
      )
    }


    // increment the drawn card in hand if its already held, otherwise append it to the end
    let cardAlreadyInHand = false
    const incrementedHand = hand.map((handCard) => {
      if (isSameCard(drawnCard, handCard)) {
        cardAlreadyInHand = true
        return { ...handCard, count: handCard.count + 1 }
      }

      return handCard
    })

    const newHand = cardAlreadyInHand
      ? incrementedHand
      : [...hand, { ...drawnCard, count: 1 }]

    return { newDeck, newHand }
  }

  const myfunc = () => {
    const { newDeck, newHand } = drawFromDeck(hand, deck)

    setDeck(newDeck)
    setHand(newHand)
  }

  return (
    <div className="text-center">
      <Button
        onClick={myfunc}
        style={{ border: '1px red solid' }}
        type="button"
      >
        abc
      </Button>
    </div>
  )
}

export default HomePage

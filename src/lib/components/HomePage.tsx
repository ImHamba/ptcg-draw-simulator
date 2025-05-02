import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { CARDS_API_URL } from '../cardData'
import { usePokeball, useProfessorsResearch } from '../cardEffects'
import { pokeballFilter, profResearchFilter } from '../cardFilters'
import { drawFirstHand, drawFromDeck, sumCardCount } from '../handDeckUtils'
import {
  checkHandMatchesDesiredHand,
  type CardData,
  type HandDeckStateChange,
  type MultiPokeCard,
} from '../utils'

const initialDeck: MultiPokeCard[] = [
  { name: 'charmander', count: 2, cardType: 'basicUserDefined' },
  { count: 2, cardType: 'basicOther' },
  { name: 'candy', count: 2, cardType: 'otherUserDefined' },
  { name: 'charizard', count: 2, cardType: 'otherUserDefined' },
  { name: 'professors Research', count: 2, cardType: 'professorsResearch' },
  { name: 'pokeball', count: 2, cardType: 'pokeball' },
  { cardType: 'other', count: 8 },
]

const initialHand: MultiPokeCard[] = [
  // { name: 'charmander', count: 1, cardType: 'basicUserDefined' },
  // { name: 'candy', count: 2, cardType: 'otherUserDefined' },
  // { name: 'professors Research', count: 1, cardType: 'professorsResearch' },
  // { name: 'pokeball', count: 1, cardType: 'pokeball' },
]

const HomePage = () => {
  const [deck, setDeck] = useState<MultiPokeCard[]>(initialDeck)

  const [hand, setHand] = useState<MultiPokeCard[]>(initialHand)

  const [desiredHand, setDesiredHand] = useState<MultiPokeCard[]>([
    { name: 'charmander', count: 1, cardType: 'basicUserDefined' },
    { name: 'candy', count: 1, cardType: 'otherUserDefined' },
    { name: 'charizard', count: 1, cardType: 'otherUserDefined' },
  ])

  const cardDataQuery = useQuery({
    queryKey: ['cardData'],
    queryFn: async () => {
      return fetch(CARDS_API_URL).then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }

        return res.json()
      })
    },
  })

  const cardData: CardData[] = cardDataQuery.data
  const { isLoading, error } = cardDataQuery

  console.log(cardData)

  // returns a callable that wraps a hand/deck state changing function with state save
  const saveHandDeckState =
    (handDeckStateChangeFn: HandDeckStateChange, ...args: any[]) =>
    () => {
      const { newHand, newDeck } = handDeckStateChangeFn(...args)
      newHand && setHand(newHand)
      newDeck && setDeck(newDeck)
    }

  const resetDeckAndHand = () => {
    setDeck(initialDeck)
    setHand(initialHand)
  }

  const renderCards = (cards: MultiPokeCard[], width: number = 5) =>
    cards.map((card, i) => {
      return (
        <div className={`aspect-63/88 w-1/${width} p-1`} key={i}>
          <Card className="full col-center text-center ">
            <div>{card.name || card.cardType}</div>
            <div>{card.count}</div>
          </Card>
        </div>
      )
    })

  const handMatchesDesired = checkHandMatchesDesiredHand(hand, desiredHand)
  const deckSize = sumCardCount(deck)
  const handSize = sumCardCount(hand)
  const hasPokeball = Boolean(hand.find(pokeballFilter))
  const hasProfResearch = Boolean(hand.find(profResearchFilter))

  return (
    <div className="flex-row justify-center p-10">
      <div className="flex-col items-center w-full">
        <div className="w-full row-center gap-10">
          <div className="w-3/5 col-center gap-3">
            <div className="text-2xl">Deck ({deckSize})</div>
            <div className="w-full flex-row flex-wrap">
              {renderCards(deck, 6)}
            </div>
          </div>
          <div className="w-2/5 col-center gap-10">
            <div className="w-full col-center gap-3">
              <div className="text-2xl">Hand ({handSize})</div>
              <div className="row-center gap-2 flex-wrap">
                <Button
                  onClick={saveHandDeckState(drawFromDeck, hand, deck)}
                  disabled={deckSize == 0}
                >
                  Draw
                </Button>
                <Button
                  onClick={saveHandDeckState(drawFirstHand, deck)}
                  disabled={deckSize < 5 || handSize > 0}
                >
                  Draw First Hand
                </Button>
                <Button
                  onClick={saveHandDeckState(usePokeball, hand, deck)}
                  disabled={!hasPokeball}
                >
                  Use PokeBall
                </Button>
                <Button
                  onClick={saveHandDeckState(useProfessorsResearch, hand, deck)}
                  disabled={!hasProfResearch}
                >
                  Use Professor's Research
                </Button>
                <Button onClick={resetDeckAndHand} disabled={handSize == 0}>
                  Reset
                </Button>
              </div>
              <div className="w-full flex-row flex-wrap">
                {renderCards(hand)}
              </div>
            </div>
            <div className="w-full col-center gap-3">
              <div className="text-2xl">Target Hands</div>
              <div
                className={
                  handMatchesDesired ? 'text-green-300' : 'text-red-400'
                }
              >
                {handMatchesDesired ? 'Matching!' : 'Not Matching'}
              </div>
              <div className="w-full flex-row flex-wrap">
                {renderCards(desiredHand)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

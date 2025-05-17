import { Button } from '@/components/ui/button'
import type { MultiPokeCard, SaveHandDeckState } from '@/lib/types'
import { usePokeball, useProfessorsResearch } from '../../cardEffects'
import { pokeballFilter, profResearchFilter } from '../../cardFilters'
import {
  drawFirstHand,
  drawFromDeck,
  resetDeckAndHand,
  sumCardCount,
} from '../../handDeckUtils'
import PokeCardDisplay from '../reuseable/PokeCardDisplay'
import PokeCardsContainer from '../reuseable/PokeCardsContainer'

type Props = {
  deck: MultiPokeCard[]
  originalDeck: MultiPokeCard[]
  hand: MultiPokeCard[]
  saveHandDeckState: SaveHandDeckState
}

const Hand = ({ deck, hand, originalDeck, saveHandDeckState }: Props) => {
  const deckSize = sumCardCount(deck)
  const handSize = sumCardCount(hand)
  const hasPokeball = Boolean(hand.find(pokeballFilter))
  const hasProfResearch = Boolean(hand.find(profResearchFilter))

  return (
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
        <Button
          onClick={saveHandDeckState(resetDeckAndHand, originalDeck)}
          disabled={handSize == 0}
        >
          Reset
        </Button>
      </div>
      <div className="w-full flex-row flex-wrap">
        <PokeCardsContainer width={8}>
          {hand.map((card) => {
            return (
              <PokeCardDisplay
                key={card.data?.id ?? card.cardType}
                card={card}
              />
            )
          })}
        </PokeCardsContainer>
      </div>
    </div>
  )
}

export default Hand

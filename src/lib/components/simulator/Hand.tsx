import { Button } from '@/components/ui/button'
import { usePokeball, useProfessorsResearch } from '../../cardEffects'
import { pokeballFilter, profResearchFilter } from '../../cardFilters'
import {
  drawFirstHand,
  drawFromDeck,
  resetDeckAndHand,
  sumCardCount,
} from '../../handDeckUtils'
import { renderCards } from '../../reactUtils'
import { type MultiPokeCard, type SaveHandDeckState } from '../../utils'

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
      <div className="w-full flex-row flex-wrap">{renderCards(hand, 8)}</div>
    </div>
  )
}

export default Hand

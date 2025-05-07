import { Button } from '@/components/ui/button'
import { type MultiPokeCard, imageUrlFromCard } from './utils'

export const renderCards = (
  cards: MultiPokeCard[],
  width: number = 5,
  incrementCard: ((card: MultiPokeCard) => void) | null = null,
  decrementCard: ((card: MultiPokeCard) => void) | null = null,
  disableIncrement: ((card: MultiPokeCard) => boolean) | null = null,
  hideButtons: ((card: MultiPokeCard) => boolean) | null = null,
) =>
  cards.map((card, i) => {
    const widths: Record<number, string> = {
      1: 'w-full',
      2: 'w-1/2',
      3: 'w-1/3',
      4: 'w-1/4',
      5: 'w-1/5',
      6: 'w-1/6',
      7: 'w-1/7',
      8: 'w-1/8',
    }
    return (
      <div className={`p-1 ${widths[width]}`} key={i}>
        <div className="aspect-367/512 ">
          <div className="full col-center text-center relative overflow-hidden p-0">
            <img
              src={imageUrlFromCard(card)}
              className="absolute top-0 left-0 z-0"
            />
          </div>
        </div>
        <div className="shrink row-center items-center text-center relative overflow-hidden p-0 gap-2 mt-1">
          {/* <div>{card.name || card.cardType}</div> */}
          {decrementCard && (!hideButtons || !hideButtons(card)) && (
            <Button
              className="p-0 h-6 aspect-square"
              onClick={() => decrementCard(card)}
            >
              -
            </Button>
          )}
          <div>{card.count}</div>
          {incrementCard && (!hideButtons || !hideButtons(card)) && (
            <Button
              className="p-0 h-6 aspect-square"
              onClick={() => incrementCard(card)}
              disabled={disableIncrement ? disableIncrement(card) : false}
            >
              +
            </Button>
          )}
        </div>
      </div>
    )
  })

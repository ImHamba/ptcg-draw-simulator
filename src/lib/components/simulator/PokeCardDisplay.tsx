import { Button } from '@/components/ui/button'
import type { MultiPokeCard } from '@/lib/appUtils'
import { imageUrlFromCard } from '@/lib/appUtils'
import { memo } from 'react'

type Props = {
  card: MultiPokeCard
  incrementCard?: (card: MultiPokeCard) => void
  decrementCard?: (card: MultiPokeCard) => void
  disableIncrement?: boolean
  hideButtons?: boolean
}

const PokeCardDisplay = ({
  card,
  incrementCard,
  decrementCard,
  disableIncrement,
  hideButtons,
}: Props) => (
  <div className={`p-1`} key={card.data?.id ?? card.cardType}>
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
      {decrementCard && !hideButtons && (
        <Button
          className="p-0 h-6 aspect-square"
          onClick={() => decrementCard(card)}
        >
          -
        </Button>
      )}
      <div>{card.count}</div>
      {incrementCard && !hideButtons && (
        <Button
          className="p-0 h-6 aspect-square"
          onClick={() => incrementCard(card)}
          disabled={disableIncrement}
        >
          +
        </Button>
      )}
    </div>
  </div>
)

export default memo(PokeCardDisplay)

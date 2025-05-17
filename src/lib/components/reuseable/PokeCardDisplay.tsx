import { Button } from '@/components/ui/button'
import { imageUrlFromCard } from '@/lib/appUtils'
import type { MultiPokeCard } from '@/lib/types'
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
}: Props) => {
  const imgUrl = imageUrlFromCard(card)

  return (
    <div className="p-1 w-full">
      <div className="aspect-367/585 w-full group">
        <div className="full col-center text-center relative overflow-hidden p-0">
          <img src={imgUrl} className="absolute top-0 left-0 z-0" />
          {card.count >= 2 && (
            <img src={imgUrl} className="absolute top-1/8 left-0 z-0" />
          )}
          <div
            className={`flex-row ${card.cardType ? 'justify-center group-hover:justify-around' : 'justify-around'} w-full h-1/6 relative px-2 top-7/12 items-center`}
          >
            {decrementCard && !hideButtons && (
              <Button
                className="hidden group-hover:flex p-0 h-4/5 aspect-square rounded-full overflow-hidden"
                onClick={() => decrementCard(card)}
              >
                -
              </Button>
            )}

            <div
              className={`${card.cardType ? 'row-center' : 'hidden group-hover:flex group-hover:flex-row'} justify-center items-center p-0 h-full aspect-square rounded-full text-primary-foreground bg-red-700 border-white border-2 drop-shadow-md`}
            >
              {card.count}
            </div>

            {incrementCard && !hideButtons && (
              <Button
                className="hidden group-hover:flex p-0 h-4/5 aspect-square rounded-full"
                onClick={() => incrementCard(card)}
                disabled={disableIncrement}
              >
                +
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(PokeCardDisplay)

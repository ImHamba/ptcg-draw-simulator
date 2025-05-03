import { DEFAULT_CARD_IMG_URL } from './cardData'
import { type MultiPokeCard, imageUrlFromCardData } from './utils'

export const renderCards = (cards: MultiPokeCard[], width: number = 5) =>
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
              src={
                card.data
                  ? imageUrlFromCardData(card.data)
                  : DEFAULT_CARD_IMG_URL
              }
              className="absolute top-0 left-0 z-0"
            />
          </div>
        </div>
        <div className="shrink col-center text-center relative overflow-hidden p-0">
          {/* <div>{card.name || card.cardType}</div> */}
          <div>{card.count}</div>
        </div>
      </div>
    )
  })

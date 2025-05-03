import { renderCards } from '../reactUtils'
import { checkHandMatchesDesiredHand, type MultiPokeCard } from '../utils'

type Props = {
  desiredHand: MultiPokeCard[]
  hand: MultiPokeCard[]
}

const TargetHands = ({ hand, desiredHand }: Props) => {
  const handMatchesDesired = checkHandMatchesDesiredHand(hand, desiredHand)

  return (
    <>
      <div className="text-2xl">Target Hands</div>
      <div className={handMatchesDesired ? 'text-green-300' : 'text-red-400'}>
        {handMatchesDesired ? 'Matching!' : 'Not Matching'}
      </div>
      <div className="w-full flex-row flex-wrap">
        {renderCards(desiredHand)}
      </div>
    </>
  )
}

export default TargetHands

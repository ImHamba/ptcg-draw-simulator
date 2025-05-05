import type { TargetHands } from '../handDeckUtils'
import { type MultiPokeCard, type SaveHandDeckState } from '../utils'
import TargetHand from './TargetHand'

type Props = {
  targetHands: TargetHands
  hand: MultiPokeCard[]
  originalDeck: MultiPokeCard[]
  saveHandDeckState: SaveHandDeckState
}

const TargetHandsPanel = ({
  hand,
  targetHands,
  originalDeck,
  saveHandDeckState,
}: Props) => {
  return (
    <div className="w-full col-center gap-3">
      <div className="text-2xl">Target Hands</div>
      <div className="flex-col gap-5 w-full">
        {[
          ...Object.keys(targetHands).map((targetHandId, i) => {
            return (
              <TargetHand
                targetHandId={targetHandId}
                targetHands={targetHands}
                hand={hand}
                originalDeck={originalDeck}
                saveHandDeckState={saveHandDeckState}
                key={'targetHand' + i}
              />
            )
          }),
          // extra component to allow user to add cards to a new target hand.
          // when a card is added, it'll generate a new id and be included in the
          // map above.
          <TargetHand
            targetHandId={null}
            targetHands={targetHands}
            hand={hand}
            originalDeck={originalDeck}
            saveHandDeckState={saveHandDeckState}
            key={'targetHand_extra'}
          />,
        ]}
      </div>
    </div>
  )
}

export default TargetHandsPanel

import { Button } from '@/components/ui/button'
import type {
  HandDeckStateChange,
  MultiPokeCard,
  SaveHandDeckState,
  TargetHands,
} from '@/lib/appUtils'
import { useCallback, useEffect } from 'react'
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
  // clear any empty target hands
  useEffect(() => {
    const entries = Object.entries(targetHands)
    const withoutEmpty = entries.filter(
      ([_, targetHand]) => targetHand.length !== 0,
    )
    const hasEmpty = withoutEmpty.length !== entries.length

    if (!hasEmpty) {
      return
    }

    const clear: HandDeckStateChange = () => {
      return {
        newTargetHands: Object.fromEntries(withoutEmpty),
      }
    }

    saveHandDeckState(clear)()
  }, [saveHandDeckState, targetHands])

  const clearAll: HandDeckStateChange = useCallback(() => {
    return {
      newTargetHands: {},
    }
  }, [])

  return (
    <div className="full col-center gap-3">
      <div className="text-2xl">
        Target Hands ({Object.keys(targetHands).length})
      </div>
      <Button className="bg-red-800" onClick={saveHandDeckState(clearAll)}>
        Clear All
      </Button>
      <div className="flex-col gap-5 full">
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

import { Button } from '@/components/ui/button'
import type {
  HandDeckStateChanger,
  MultiPokeCard,
  SaveHandDeckState,
  TargetHands,
} from '@/lib/types'
import { conditionalListItem } from '@/lib/utils'
import { useCallback, useEffect } from 'react'
import TargetHand from './TargetHand'

type Props = {
  targetHands: TargetHands
  originalDeck: MultiPokeCard[]
  saveHandDeckState: SaveHandDeckState
  guideDisplay?: boolean // for customised display in the user guide
}

const TargetHandsPanel = ({
  targetHands,
  originalDeck,
  saveHandDeckState,
  guideDisplay = false,
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

    const clear: HandDeckStateChanger = () => {
      return {
        newTargetHands: Object.fromEntries(withoutEmpty),
      }
    }

    saveHandDeckState(clear)()
  }, [saveHandDeckState, targetHands])

  const clearAll: HandDeckStateChanger = useCallback(() => {
    return {
      newTargetHands: {},
    }
  }, [])

  return (
    <div className="full col-center gap-3">
      {!guideDisplay && (
        <>
          <div className="text-2xl">
            Target Hands ({Object.keys(targetHands).length})
          </div>
          <Button variant="destructive" onClick={saveHandDeckState(clearAll)}>
            Clear All
          </Button>
        </>
      )}
      <div className="flex-col gap-5 full">
        {[
          ...Object.keys(targetHands).map((targetHandId, i) => {
            return (
              <TargetHand
                targetHandId={targetHandId}
                targetHands={targetHands}
                originalDeck={originalDeck}
                saveHandDeckState={saveHandDeckState}
                guideDisplay={guideDisplay}
                key={'targetHand' + i}
              />
            )
          }),
          // extra component to allow user to add cards to a new target hand.
          // when a card is added, it'll generate a new id and be included in the
          // map above.
          ...conditionalListItem(
            <TargetHand
              targetHandId={null}
              targetHands={targetHands}
              originalDeck={originalDeck}
              saveHandDeckState={saveHandDeckState}
              key={'targetHand_extra'}
            />,
            // dont display in the guide dialog
            !guideDisplay,
          ),
        ]}
      </div>
    </div>
  )
}

export default TargetHandsPanel

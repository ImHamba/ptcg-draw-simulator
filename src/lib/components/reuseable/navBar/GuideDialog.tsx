import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  dummyChartData,
  dummyChartDataKeys,
  dummyDeck,
  dummySaveHandDeckState,
  dummyTargetHands,
} from '@/lib/guideDialogDummyData'
import type { CardData } from '@/lib/types'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import DeckPanel from '../../simulator/DeckPanel'
import TargetHandsPanel from '../../simulator/TargetHandsPanel'
import SimulatorChart from '../SimulatorChart'

type Props = {
  children: ReactNode
  cardData: CardData[]
}

const GuideDialog = ({ children, cardData }: Props) => {
  const [open, setOpen] = useState(false)
  const [showHeavyContent, setShowHeavyContent] = useState(false)

  useEffect(() => {
    if (open) {
      // Delay rendering heavy content after the first paint
      const timeout = setTimeout(() => {
        setShowHeavyContent(true)
      })

      return () => clearTimeout(timeout)
    } else {
      setShowHeavyContent(false)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-[90vw] md:min-w-[70vw] xl:min-w-[50vw] max-h-[97vh] md:max-h-[90dvh] overflow-y-auto">
        <DialogHeader className="w-full">
          <DialogTitle className="text-2xl">Draw Simulator Guide</DialogTitle>
        </DialogHeader>
        <div className="w-full ps-4 md:px-5 flex">
          <ol className="w-full list-decimal list-outside [&>li]:ps-5 [&>li]:w-full flex flex-col gap-7">
            <li>
              <div className="flex flex-col gap-1">
                <h5>Build your deck</h5>
                <p>
                  Use the Deck Builder panel to add cards you want to calculate
                  draw probabilities of, as well as Poke Balls and Professor's
                  Research.
                </p>
                <p className="mb-5">
                  Ensure your deck has the correct number of basic Pokemon. You
                  can click the <b>Add Generic Basic</b> button as a stand-in
                  for any basic Pokemon. Any remaining cards will automatically
                  be filled in as generic cards up to a total of 20.
                </p>

                <div className="row-center">
                  <div className="w-full lg:w-4/5">
                    <DeckPanel
                      originalDeck={dummyDeck}
                      cardData={cardData}
                      targetHands={dummyTargetHands}
                      saveHandDeckState={dummySaveHandDeckState}
                      guideDisplay
                      isCardDataLoading={false}
                    />
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="flex flex-col gap-1">
                <h5>Create target hands</h5>
                <p className="mb-5">
                  Use the Target Hands panel to create desirable hands using the
                  cards in your deck, that you want to calculate the draw
                  probabilities of. You can create as many target hands as you
                  want.
                </p>

                {showHeavyContent && (
                  <TargetHandsPanel
                    targetHands={dummyTargetHands}
                    originalDeck={dummyDeck}
                    saveHandDeckState={dummySaveHandDeckState}
                    guideDisplay={true}
                  />
                )}
              </div>
            </li>
            <li>
              <div className="flex flex-col gap-2">
                <h5>Run draw simulation</h5>
                <p>
                  Click <b>Start</b> in the Draw Simulator panel to begin
                  simulating thousands of hand draws. It will draw 6 cards on
                  turn 1 and then repeatedly draw from your deck until you have
                  drawn any of your target hands. Poke Balls and Professor's
                  Research will be used as they are drawn.
                </p>
                <p className="mb-5">
                  The results chart will show the probability of each target
                  hand being the first target hand achieved in that simulation,
                  and the cumulative line shows the probability on each turn of
                  having achieved any of your target hands.
                </p>
                <div className="row-center">
                  <div className="h-80 w-full max-w-160">
                    {showHeavyContent && (
                      <SimulatorChart
                        chartData={dummyChartData}
                        targetHandIds={dummyChartDataKeys}
                      />
                    )}
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GuideDialog

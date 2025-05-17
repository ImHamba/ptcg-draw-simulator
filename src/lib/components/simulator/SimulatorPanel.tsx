import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { checkHandMatchesTargetHands } from '@/lib/appUtils'
import { basicPokemonFilter } from '@/lib/cardFilters'
import type { MultiPokeCard, TargetHands } from '@/lib/types'
import { useMemo, useRef, useState } from 'react'
import { FIRST_HAND_SIZE, MAX_DECK_SIZE } from '../../constants'
import {
  drawFirstHand,
  drawFromDeck,
  playSpecialCards,
} from '../../handDeckUtils'
import { sumObjects } from '../../utils'
import SimulatorChart from '../reuseable/SimulatorChart'

type Props = {
  originalDeck: MultiPokeCard[]
  targetHands: TargetHands
}

const SimulatorPanel = ({ originalDeck, targetHands }: Props) => {
  // ref so simulation loop can access the value in real time that may be changed by user interaction
  const doSimulationRef = useRef(false)
  const [doSimulation, _setDoSimulation] = useState(doSimulationRef.current)
  const [simulationCount, setSimulationCount] = useState(0)

  const simulationLimit = 10000

  // initialise simulation results data structure.
  // the top level holds a key for each possible number of draws (until deck is depleted).
  // each value holds the cumulative sums of each target hand that was matched first in a simulation at the
  // given number of draws.
  // e.g. target hand X was the first target hand to be matched 150 times at the 4th draw of the game
  const initialCumulativeSimulationResults: Record<
    string,
    Record<'any' | keyof TargetHands, number>
  > = Object.fromEntries([
    ...Array.from({ length: MAX_DECK_SIZE - FIRST_HAND_SIZE + 1 }, (_, i) => [
      i,
      {
        ...Object.fromEntries(
          Object.entries(targetHands).map(([targetHandId, _]) => {
            return [targetHandId, 0]
          }),
        ),

        // additional property to track when any hand is matched
        // since multiple hands can match on the same draw.
        // the value of these properties from all the draw counts should sum
        // to the total number of simulations done.
        anyMatch: 0,
      },
    ]),
  ])

  const [cumulativeSimulationResults, setCumulativeSimulationResults] =
    useState(initialCumulativeSimulationResults)

  const setDoSimulation = (value: boolean) => {
    doSimulationRef.current = value
    _setDoSimulation(value)
  }

  // simulates a single round of drawing from the full deck until at least 1 target hand is matched
  // returns an obj indicating which target hand was first matched (could be multiple) and how many draws
  // it took (first hand is 0 draws)
  const drawSimulation = () => {
    let hand: MultiPokeCard[]
    let deck = originalDeck
    let drawCount = 0

    // check matches after drawing first hand and using special cards
    ;({ newHand: hand, newDeck: deck } = drawFirstHand(deck))
    ;({ newHand: hand, newDeck: deck } = playSpecialCards(hand, deck))

    let targetHandMatches = checkHandMatchesTargetHands(hand, targetHands)

    // if not matching, repeat drawing and using any special cards
    while (!targetHandMatches.anyMatch) {
      ;({ newHand: hand, newDeck: deck } = drawFromDeck(hand, deck))
      ;({ newHand: hand, newDeck: deck } = playSpecialCards(hand, deck))

      targetHandMatches = checkHandMatchesTargetHands(hand, targetHands)

      drawCount++
    }

    return { targetHandMatches, drawCount }
  }

  const simulate = async () => {
    setDoSimulation(true)
    setSimulationCount(0)

    const timeBudgetMs = 10
    let innerLoopCount = 0

    setCumulativeSimulationResults(initialCumulativeSimulationResults)

    while (doSimulationRef.current && innerLoopCount < simulationLimit) {
      const frameStart = performance.now()

      while (
        performance.now() - frameStart < timeBudgetMs &&
        innerLoopCount < simulationLimit
      ) {
        const { targetHandMatches, drawCount } = drawSimulation()
        setCumulativeSimulationResults((prev) => {
          return {
            ...prev,
            [drawCount]: sumObjects(targetHandMatches, prev[drawCount]),
          }
        })
        innerLoopCount++
      }

      await new Promise((resolve) => requestAnimationFrame(resolve))

      setSimulationCount(innerLoopCount)
    }
    setDoSimulation(false)
  }

  const stopSimulation = () => {
    setDoSimulation(false)
  }

  const chartData = useMemo(
    () =>
      Object.entries(cumulativeSimulationResults)
        // exclude results for high draw counts if the results only have 0s
        .filter((_, i) => {
          const followingItems = Object.entries(
            cumulativeSimulationResults,
          ).slice(i)
          const followingAreZeros = followingItems.every(
            ([_, targetHandMatches]) => targetHandMatches.anyMatch <= 0,
          )

          return !followingAreZeros
        })
        .map(([drawCount, targetHandMatches]) => {
          const chartBar: Record<string, number | string> = {
            // transform draw count to turns past
            name: (Number(drawCount) + 1).toString(),
            ...Object.fromEntries(
              Object.entries(targetHandMatches).map(
                ([targetHandId, matchCount]) => {
                  return [targetHandId, (matchCount / simulationCount) * 100]
                },
              ),
            ),
          }

          return chartBar
        })
        // track cumulative values of anyMatch over the draw counts
        .reduce(
          (acc, chartBar) => {
            // @ts-ignore
            const cumulative = acc.cumulative + (chartBar.anyMatch as number)
            return {
              data: [...acc.data, { ...chartBar, cumulative: cumulative }],
              cumulative: cumulative,
            }
          },
          { data: [], cumulative: 0 } as {
            data: Record<string, number>[]
            cumulative: number
          },
        ).data,
    [cumulativeSimulationResults, simulationCount],
  )

  const targetHandIds = useMemo(() => Object.keys(targetHands), [targetHands])

  const placeholderChartData = useMemo(
    () =>
      Array(8)
        .fill(0)
        .map((_, i) => {
          return { name: i + 1, anyMatch: 0 }
        }),
    [],
  )

  const actualChartData = useMemo(
    () => (chartData.length ? chartData : placeholderChartData),
    [chartData, placeholderChartData],
  )

  const deckHasBasic = useMemo(
    () => originalDeck.filter(basicPokemonFilter).length > 0,
    [originalDeck],
  )
  const targetHandsDefined = useMemo(
    () => targetHandIds.length > 0,
    [targetHandIds.length],
  )
  const canStartSimulation = useMemo(
    () => deckHasBasic && targetHandsDefined,
    [deckHasBasic, targetHandsDefined],
  )

  return (
    <div className="full col-center gap-3">
      <div className="col-center gap-1">
        <div className="text-2xl">Draw Simulator</div>
      </div>
      {simulationCount}/{simulationLimit} simulations
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={doSimulation ? stopSimulation : simulate}
              disabled={!canStartSimulation}
            >
              {doSimulation ? 'Stop' : 'Start'}
            </Button>
          </TooltipTrigger>
          {!canStartSimulation && (
            <TooltipContent side='bottom'>
              <ul className='list-disc list-inside text-sm p-0.5 pe-1'>
                {!deckHasBasic && (
                  <li>Add at least 1 basic Pokemon to your deck.</li>
                )}
                {!targetHandsDefined && <li>Create a target hand.</li>}
              </ul>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <SimulatorChart
        chartData={actualChartData}
        targetHandIds={targetHandIds}
      />
    </div>
  )
}

export default SimulatorPanel

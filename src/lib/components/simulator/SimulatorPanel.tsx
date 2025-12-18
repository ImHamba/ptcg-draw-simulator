import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { checkHandMatchesTargetHands } from '@/lib/appUtils'

import { playTrainerEffectCards } from '@/lib/cardEffects/cardEffectLogic'
import { basicPokemonFilter } from '@/lib/cardFilters'
import type { DrawState, MultiPokeCard, TargetHands } from '@/lib/types'
import { useMemo, useRef, useState } from 'react'
import { drawFirstHand, drawFromDeck } from '../../handDeckUtils'
import { sumObjects } from '../../utils'
import SimulatorChart from '../reuseable/SimulatorChart'

type CumulativeSimulationResults = Record<
  string | number,
  Record<'any' | keyof TargetHands, number>
>

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

  /**
   * function to access the simulation results data structure by key,
   * with initialisation of defaults if key doesn't exist.
   * The resulting structure of the results is as follows:
   * - the top level holds a key for each possible number of draws (until deck is depleted).
   * - each value holds the cumulative sums of each target hand that was matched first in a simulation at the
   * given number of draws.
   *   - e.g. target hand X was the first target hand to be matched 150 times at the 4th draw of the game
   */
  const accessCumulativeSimulationResults = (
    simResults: CumulativeSimulationResults,
    key: string | number,
  ) => {
    // if simulation results already have the key, just return it
    return key in simResults
      ? simResults[key]
      : // otherwise return an initialised object starting at 0 count
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
        }
  }

  const [cumulativeSimulationResults, setCumulativeSimulationResults] =
    useState<CumulativeSimulationResults>({})

  const setDoSimulation = (value: boolean) => {
    doSimulationRef.current = value
    _setDoSimulation(value)
  }

  // Simulates a single round of drawing from the full deck until at least 1 target hand is matched.
  // Returns an obj indicating which target hand was first matched (could be multiple) and how many draws
  // it took (first hand is 0 draws)
  const drawSimulation = (
    drawState: DrawState = {
      hand: [], // start with empty hand
      deck: originalDeck, // start with full deck
    },
    drawCount: number = 0,
  ) => {
    // Draw cards depending on whether it's the first hand or subsequent draws
    const resultAfterDraw =
      drawCount === 0 ? drawFirstHand(drawState.deck) : drawFromDeck(drawState)

    const newDrawState = playTrainerEffectCards(
      resultAfterDraw.drawState,
      targetHands,
    )

    const targetHandMatches = checkHandMatchesTargetHands(
      newDrawState.hand,
      targetHands,
    )

    // base case: If a match is found, return the result
    if (targetHandMatches.anyMatch) {
      return { targetHandMatches, drawCount }
    }

    // recursive case: Continue drawing and checking
    return drawSimulation(newDrawState, drawCount + 1)
  }

  const simulate = async () => {
    setDoSimulation(true)
    setSimulationCount(0)

    const timeBudgetMs = 10
    let innerLoopCount = 0

    setCumulativeSimulationResults({})

    while (doSimulationRef.current && innerLoopCount < simulationLimit) {
      const frameStart = performance.now()

      while (
        performance.now() - frameStart < timeBudgetMs &&
        innerLoopCount < simulationLimit
      ) {
        const simulationResult = drawSimulation()

        const { targetHandMatches, drawCount } = simulationResult
        setCumulativeSimulationResults((prev) => {
          return {
            ...prev,
            [drawCount]: sumObjects(
              targetHandMatches,
              accessCumulativeSimulationResults(prev, drawCount),
            ),
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

  const showSimulationProgressBar =
    simulationCount > 0 && simulationCount < simulationLimit

  return (
    <div className="full col-center gap-3">
      <div className="col-center gap-1">
        <div className="text-2xl">Draw Simulator</div>
      </div>
      <div>
        <span className="relative">
          {simulationCount}/{simulationLimit} simulations
          <div
            className={`absolute -bottom-1 left-0 bg-green-300 h-0.5 rounded-full transition-opacity ${showSimulationProgressBar ? 'opacity-100' : 'duration-600 opacity-0'}`}
            style={{
              width: `${(simulationCount / simulationLimit) * 100}%`,
            }}
          />
        </span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={doSimulation ? stopSimulation : simulate}
              disabled={!canStartSimulation}
              variant={doSimulation ? 'destructive' : 'outline'}
            >
              {doSimulation ? 'Stop' : 'Start'}
            </Button>
          </TooltipTrigger>
          {!canStartSimulation && (
            <TooltipContent side="bottom">
              <ul className="list-disc list-inside text-sm p-0.5 pe-1">
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

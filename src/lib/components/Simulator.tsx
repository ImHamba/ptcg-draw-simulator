import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FIRST_HAND_SIZE, MAX_DECK_SIZE } from '../constants'
import { drawFirstHand, drawFromDeck, type TargetHands } from '../handDeckUtils'
import {
  checkHandMatchesTargetHands,
  sumObjects,
  type MultiPokeCard,
  type SaveHandDeckState,
} from '../utils'

type Props = {
  deck: MultiPokeCard[]
  originalDeck: MultiPokeCard[]
  saveHandDeckState: SaveHandDeckState
  targetHands: TargetHands
}

const Simulator = ({
  //   deck,
  originalDeck,
  targetHands,
  //   saveHandDeckState,
}: Props) => {
  // ref so simulation loop can access the value in real time that may be changed by user interaction
  const doSimulationRef = useRef(false)
  const [doSimulation, _setDoSimulation] = useState(doSimulationRef.current)
  const [simulationCount, setSimulationCount] = useState(0)

  // initialise simulation results data structure.
  // the top level holds a key for each possible number of draws (until deck is depleted).
  // each value holds the cumulative sums of each target hand that was matched first in a simulation at the
  // given number of draws.
  // e.g. target hand X was the first target hand to be matched 150 times at the 4th draw of the game
  const initialCumulativeSimulationResults = Object.fromEntries(
    Array.from({ length: MAX_DECK_SIZE - FIRST_HAND_SIZE + 1 }, (_, i) => [
      i,
      Object.fromEntries(
        Object.entries(targetHands).map(([targetHandId, _]) => {
          return [targetHandId, 0]
        }),
      ),
    ]),
  )
  const [cumulativeSimulationResults, setCumulativeSimulationResults] =
    useState(initialCumulativeSimulationResults)

  //   useEffect(() => {
  //     console.log(cumulativeSimulationResults)
  //   }, [cumulativeSimulationResults])

  const setDoSimulation = (value: boolean) => {
    doSimulationRef.current = value
    _setDoSimulation(value)
  }

  // simulates a single round of drawing from the full deck until at least 1 target hand is matched
  // returns an obj indicating which target hand was first matched (could be multiple) and how many draws
  // it took (first hand is 0 draws)
  const drawSimulation = () => {
    let hand: MultiPokeCard[] = []
    let deck = originalDeck
    let drawCount = 0

    const firstHandDrawResult = drawFirstHand(deck)
    hand = firstHandDrawResult.newHand
    deck = firstHandDrawResult.newDeck

    let targetHandMatches = checkHandMatchesTargetHands(hand, targetHands)

    while (!targetHandMatches.anyMatch) {
      const drawResult = drawFromDeck(hand, deck)
      hand = drawResult.newHand
      deck = drawResult.newDeck

      targetHandMatches = checkHandMatchesTargetHands(hand, targetHands)
      drawCount++
    }

    return { targetHandMatches: targetHandMatches.targetHandMatches, drawCount }
  }

  const simulate = async () => {
    setDoSimulation(true)
    setSimulationCount(0)

    const timeBudgetMs = 10
    const limit = 10000
    let innerLoopCount = 0

    setCumulativeSimulationResults(initialCumulativeSimulationResults)

    while (doSimulationRef.current && innerLoopCount < limit) {
      const frameStart = performance.now()

      while (
        performance.now() - frameStart < timeBudgetMs &&
        innerLoopCount < limit
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
    console.log('stop')
    setDoSimulation(false)
  }

  const chartData = Object.entries(cumulativeSimulationResults).map(
    ([drawCount, targetHandMatches]) => {
      return {
        name: drawCount,
        ...Object.fromEntries(
          Object.entries(targetHandMatches).map(([_, matchCount], i) => {
            return [
              `Target Hand ${i + 1}`,
              (matchCount / simulationCount) * 100,
            ]
          }),
        ),
      }
    },
  )

  console.log(targetHands, chartData)

  const targetHandIds = Object.keys(targetHands)

  return (
    <div className="full col-center gap-3">
      <div className="text-2xl">Draw Simulator {simulationCount}</div>

      <div className="row-center gap-2">
        <Button onClick={doSimulation ? stopSimulation : simulate}>
          {doSimulation ? 'Stop' : 'Start'}
        </Button>
        <Button
          onClick={() => {
            const a = drawSimulation()
            console.log(a)
          }}
        >
          Test
        </Button>
      </div>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid />
          <Tooltip />
          <Legend />
          <YAxis
            type="number"
            label={{
              value: 'Target hand achieved %',
              angle: -90,
              dx: -15,
              //   position: 'insideLeft',
              //   offset: 20,
            }}
          />
          <XAxis dataKey="name" label={{ value: 'Draw Count', dy: 10 }} />
          {targetHandIds.map((_, i) => (
            <Bar dataKey={`Target Hand ${i + 1}`} stackId={1} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Simulator

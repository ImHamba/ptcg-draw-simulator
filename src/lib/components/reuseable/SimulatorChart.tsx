import { memo } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getHexColorForValue } from '../../utils'

type Props = {
  chartData: Record<string, number>[]
  targetHandIds: string[]
}

const SimulatorChart = ({ chartData, targetHandIds }: Props) => {
  const maxDrawCount = Math.max(...chartData.map((data) => data.drawCount))
  const dataMap = new Map(chartData.map((data) => [data.drawCount, data]))

  // fill in any gaps in the chart data for turn counts that didnt eventuate during the simulation
  const filledInChartData = Array.from(
    { length: Math.max(maxDrawCount, 5) + 1 },
    (_, i) => i,
  ).reduce(
    (acc, drawCount) => {
      const currentTurnData = dataMap.get(drawCount)
      const prevValidTurnData = currentTurnData ?? acc.prevValidTurnData
      const turnData = currentTurnData
        ? { ...currentTurnData, name: drawCount }
        : {
            name: drawCount,
            anyMatch: 0,
            cumulative: prevValidTurnData?.cumulative ?? 0,
            ...Object.fromEntries(targetHandIds.map((id) => [id, 0])),
          }
      return {
        filledChartData: [...acc.filledChartData, turnData],
        prevValidTurnData,
      }
    },
    {
      filledChartData: [],
      prevValidTurnData: null,
    } as {
      filledChartData: Record<string, number>[]
      prevValidTurnData: Record<string, number> | null
    },
  ).filledChartData

  console.log(
    filledInChartData,
    Array.from({ length: Math.min(maxDrawCount, 5) + 1 }, (_, i) => i),
  )

  return (
    <ResponsiveContainer>
      <ComposedChart data={filledInChartData}>
        <CartesianGrid />
        <Tooltip
          formatter={(value: number) => `${value.toFixed(1)}%`}
          labelFormatter={(turn) => (
            <b>{`Turn ${turn} (${parseInt(turn) + 5} natural draws)`}</b>
          )}
        />
        <Legend />
        <YAxis
          type="number"
          label={{
            value: 'Target hand achieved %',
            angle: -90,
            dx: -15,
          }}
          domain={[0, (dataMax: number) => Math.min(dataMax, 100)]}
          tickFormatter={(value: number) => value.toFixed(0)}
        />
        <XAxis dataKey="name" label={{ value: 'Turn', dy: 13 }} />
        <Bar dataKey="anyMatch" name="Any target hand" />
        <Line dataKey="cumulative" name="Cumulative any" />
        {targetHandIds.map((targetHandId, i) => {
          return (
            <Bar
              dataKey={targetHandId}
              name={`Target hand ${i + 1}`}
              // TODO: choose colors based on deck type
              fill={getHexColorForValue(i / targetHandIds.length, 0.55, 0.75)}
            />
          )
        })}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default memo(SimulatorChart)

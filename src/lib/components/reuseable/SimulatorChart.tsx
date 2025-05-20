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
  return (
    <ResponsiveContainer>
      <ComposedChart data={chartData}>
        <CartesianGrid />
        <Tooltip
          formatter={(value: number) => `${value.toFixed(1)}%`}
          labelFormatter={(turn) => (
            <b>
              {`Turn ${turn} (${parseInt(turn) + 5} natural draws)`}
            </b>
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

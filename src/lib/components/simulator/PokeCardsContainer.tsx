import type { ReactNode } from 'react'
import { memo } from 'react'

type Props = {
  width: number
  children: ReactNode
}

const PokeCardsContainer = ({ width = 5, children }: Props) => (
  <div
    className="grid full overflow-x-auto"
    style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
  >
    {children}
  </div>
)

export default memo(PokeCardsContainer)

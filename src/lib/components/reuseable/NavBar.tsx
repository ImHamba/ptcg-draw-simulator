import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'

import type { CardData } from '@/lib/types'
import GuideDialog from './GuideDialog'

type Props = {
  children: ReactNode
  cardData: CardData[]
}
const NavBar = ({ cardData, children }: Props) => {
  return (
    <div className="h-15 py-1 px-10 bg-gray-50 z-20 flex-row content-between items-center">
      <div className="flex-row items-center text-2xl full">
        <img src="logo512.png" className="h-full me-1" />
        {children}
      </div>

      <GuideDialog cardData={cardData}>
        <Button
          className="h-[85%] flex-row items-center text-xl font-normal"
          variant="ghost"
        >
          About/Guide
        </Button>
      </GuideDialog>
    </div>
  )
}

export default NavBar

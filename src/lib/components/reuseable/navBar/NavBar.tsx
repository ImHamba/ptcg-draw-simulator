import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'

import type { CardData } from '@/lib/types'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Link } from '@tanstack/react-router'
import NavBarMenu from './NavBarMenu'

type Props = {
  children: ReactNode
  cardData: CardData[]
}
const NavBar = ({ cardData, children }: Props) => {
  return (
    <div className="h-15 py-2 md:py-1 px-2 md:px-10 bg-gray-50 z-20 flex flex-row justify-between items-center relative">
      <Link to="/" className="h-full">
        <div className="flex flex-row items-center text-2xl full">
          <img src="logo512.png" className="h-full me-1" />
          {children}
        </div>
      </Link>

      {/* menu for large screens */}
      <div className="hidden md:block">
        <NavBarMenu cardData={cardData} />
      </div>

      <Popover>
        {/* collapsible menu for small screens */}
        <PopoverTrigger asChild>
          <Button
            className="h-[85%] aspect-5/4 p-0 md:hidden"
            variant="ghost"
          >
            <i className="fa-solid fa-bars fa-xl" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="md:hidden w-screen p-1.5 bg-gray-50 border-0 rounded-xl rounded-t-none border-t-1">
          <NavBarMenu cardData={cardData} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default NavBar

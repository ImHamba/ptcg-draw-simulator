import { Button } from '@/components/ui/button'

import type { CardData } from '@/lib/types'

import { atLeast, useScreenSize } from '@/lib/hooks/useScreenSize'
import { Link } from '@tanstack/react-router'
import GuideDialog from './GuideDialog'

type Props = {
  cardData: CardData[]
}
const NavBarMenu = ({ cardData }: Props) => {
  const screenSize = useScreenSize()
  return (
    <div className="flex flex-col md:flex-row gap-2 items-center">
      {!atLeast(screenSize, 'md') && (
        <Button
          asChild
          className="full row-center text-xl font-normal"
          variant="ghost"
        >
          <Link to="/">Home</Link>
        </Button>
      )}
      <GuideDialog cardData={cardData}>
        <Button className="full row-center text-xl font-normal" variant="ghost">
          About/Guide
        </Button>
      </GuideDialog>
    </div>
  )
}

export default NavBarMenu

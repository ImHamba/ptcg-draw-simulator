import { Button } from '@/components/ui/button'

import type { CardData } from '@/lib/types'
import GuideDialog from './GuideDialog'

type Props = {
  cardData: CardData[]
}
const NavBarMenu = ({ cardData }: Props) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 items-center">
      <GuideDialog cardData={cardData}>
        <Button
          className="h-[85%] w-full flex flex-row items-center text-xl font-normal"
          variant="ghost"
        >
          About/Guide
        </Button>
      </GuideDialog>
    </div>
  )
}

export default NavBarMenu

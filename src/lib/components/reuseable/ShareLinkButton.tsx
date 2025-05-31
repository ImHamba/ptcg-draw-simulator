import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { PopoverArrow } from '@radix-ui/react-popover'

type Props = {
  onShareLinkClick: () => void
  disabled: boolean
}

export function ShareLinkButton({ onShareLinkClick, disabled }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button onClick={onShareLinkClick} disabled={disabled}>
          <i className="fa-regular fa-clipboard" />
          Share Deck
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-primary w-fit text-white p-2 rounded-md border-0">
        <PopoverArrow className="fill-primary" />
        <div className="w-fit font-normal text-sm px-2">
          Link copied to clipboard!
        </div>
      </PopoverContent>
    </Popover>
  )
}

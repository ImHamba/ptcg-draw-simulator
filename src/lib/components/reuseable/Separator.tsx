import { twMerge } from 'tailwind-merge'

type Props = {
  className?: string
}

const Separator = ({ className = '' }: Props) => {
  return (
    <div
      className={twMerge('border-t border-gray-300 block my-4', className)}
    />
  )
}

export default Separator

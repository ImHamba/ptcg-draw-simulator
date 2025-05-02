import { useIsRestoring } from '@tanstack/react-query'
import { type ReactNode } from 'react'

type Props = {
  children: ReactNode
}
const PersistGate = ({ children }: Props) => {
  const isRestoring = useIsRestoring()

  console.log(isRestoring)

  return isRestoring ? <div>restoring</div> : children
}

export default PersistGate

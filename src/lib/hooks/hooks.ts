import { useEffect, useRef } from 'react'

export const useIsMount = () => {
  const isFirst = useRef(true)

  useEffect(() => {
    isFirst.current = false
  }, [])

  return isFirst.current
}

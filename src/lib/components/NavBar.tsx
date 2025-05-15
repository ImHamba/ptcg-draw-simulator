import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}
const NavBar = ({ children }: Props) => {
  return (
    <div className="h-15 py-1 px-10 bg-gray-50 z-100 flex-row content-between">
      <div className="flex-row items-center text-2xl full">
        <img src="/public/logo512.png" className="h-full me-1" />
        {children}
      </div>

      <Link className="flex-row items-center text-xl" to="/">
        About/Guide
      </Link>
    </div>
  )
}

export default NavBar

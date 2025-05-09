import { Link } from '@tanstack/react-router'

const HomePage = () => {
  return (
    <div>
      Welcome!
      <Link to="/simulator">Go to Simulator</Link>
    </div>
  )
}

export default HomePage

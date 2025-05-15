import { router } from '@/main'
import { Link } from '@tanstack/react-router'

const HomePage = () => {
  router.navigate({
    to: '/simulator',
  })
  return (
    <div>
      Welcome!
      <Link to="/simulator">Go to Simulator</Link>
    </div>
  )
}

export default HomePage

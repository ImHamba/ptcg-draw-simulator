import { Link, useRouter } from '@tanstack/react-router'

const HomePage = () => {
  const router = useRouter()
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

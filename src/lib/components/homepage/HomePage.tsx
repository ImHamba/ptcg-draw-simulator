import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import {
  atLeast,
  useScreenSize,
  useWindowSize,
} from '../../hooks/useScreenSize'
import PokeBallSvg from '../reuseable/PokeBallSvg'
import CardsArc from './CardsArc'

const HomePage = () => {
  const screenSize = useScreenSize()
  const { width: screenWidth } = useWindowSize()

  const numCards = Math.max(Math.floor(screenWidth / 150), 4)

  return (
    <div className="w-screen h-screen col-center bg-[linear-gradient(110deg,_#eae6ff,_#d4f0fc)] p-5 md:p-10 pb-[30vh] overflow-hidden relative">
      {/* spacer that shrinks on smaller screens */}
      <div className="flex-1 max-h-[30vh]" />

      <div className="w-full col-center relative [&>*]:z-10">
        <PokeBallSvg
          color="white"
          className="aspect-square absolute top-1/2 left-1/2 h-[300%] max-w-[150%] transform -translate-x-1/2 -translate-y-1/2 opacity-45"
        />
        <div className="col-center w-full">
          <div className="row-center items-center w-full order-2 mt-3 ">
            {atLeast(screenSize, 'md') && (
              <img src="logo512.png" className="h-20 md:me-3" />
            )}
            <h1 className="text-5xl font-medium text-center">
              Hand Draw Simulator
            </h1>
          </div>
          <h2 className="text-3xl order-1 text-center">Pokemon TCG Pocket</h2>
        </div>
        <p className="mt-7 text-lg max-w-160 text-center">
          A tool to estimate the draw consistency of your Pokemon TCG Pocket
          decks, using Monte Carlo simulation.
        </p>
        <Link
          className={`mt-5 ${buttonVariants({ variant: 'outline' })} bg-[#3562b0]`}
          to="/simulator"
        >
          Go to Simulator
        </Link>
      </div>

      <div
        className="absolute"
        style={{ bottom: `${(-100 / numCards) * 0.95}vw` }}
      >
        <CardsArc numCards={numCards} />
      </div>
    </div>
  )
}

export default HomePage

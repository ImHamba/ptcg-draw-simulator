import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import PokeBallSvg from './reuseable/PokeBallSvg'

const HomePage = () => {
  return (
    // #eae6ff
    // #d4f0fc

    <div className="w-screen h-screen col-center bg-[linear-gradient(110deg,_#eae6ff,_#d4f0fc)] pt-[30vh]">
      <div className="col-center relative [&>*]:z-10">
        <PokeBallSvg
          color="white"
          className="aspect-square absolute top-1/2 left-1/2 h-[300%] max-w-[150%] transform -translate-x-1/2 -translate-y-1/2 opacity-45"
        />
        <div className="col-center w-full">
          <div className="row-center items-center w-full order-2 mt-3 ">
            <img src="logo512.png" className="h-20 me-3" />
            <h1 className="text-5xl font-medium ">Hand Draw Simulator</h1>
          </div>
          <h2 className="text-3xl order-1">Pokemon TCG Pocket</h2>
        </div>
        <p className="mt-7 font-medium">
          A tool to calculate the draw consistency of your Pokemon TCG
          Pocket decks.
        </p>
        <p className="mt-1">Never wonder why your deck is bricking again!</p>
        <Link
          className={`mt-5 ${buttonVariants({ variant: 'outline' })} bg-[#3562b0]`}
          to="/simulator"
        >
          Go to Simulator
        </Link>
      </div>
    </div>
  )
}

export default HomePage

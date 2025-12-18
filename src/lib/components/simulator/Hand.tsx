// import { Button } from '@/components/ui/button'
// import { playProfessorsResearch } from '@/lib/cardEffects/supporterCardEffect'
// import type { DrawState, MultiPokeCard, SaveHandDeckState } from '@/lib/types'
// import { playPokeball } from '../../cardEffects/nonSupporterCardEffects'
// import { pokeballFilter, profResearchFilter } from '../../cardFilters'
// import {
//   adaptToFullState,
//   drawFirstHand,
//   drawFromDeck,
//   resetDeckAndHand,
//   sumCardCount,
// } from '../../handDeckUtils'
// import PokeCardDisplay from '../reuseable/PokeCardDisplay'
// import PokeCardsContainer from '../reuseable/PokeCardsContainer'

// type Props = {
//   drawState: DrawState
//   originalDeck: MultiPokeCard[]
//   saveHandDeckState: SaveHandDeckState
// }

// const Hand = ({ drawState, originalDeck, saveHandDeckState }: Props) => {
//   const deckSize = sumCardCount(drawState.deck)
//   const handSize = sumCardCount(drawState.hand)
//   const hasPokeball = Boolean(drawState.hand.find(pokeballFilter))
//   const hasProfResearch = Boolean(drawState.hand.find(profResearchFilter))

//   return (
//     <div className="w-full col-center gap-3">
//       <div className="text-2xl">Hand ({handSize})</div>
//       <div className="row-center gap-2 flex-wrap">
//         <Button
//           onClick={saveHandDeckState(drawFromDeck, drawState)}
//           disabled={deckSize == 0}
//         >
//           Draw
//         </Button>
//         <Button
//           onClick={saveHandDeckState(drawFirstHand, drawState.deck)}
//           disabled={deckSize < 5 || handSize > 0}
//         >
//           Draw First Hand
//         </Button>
//         <Button
//           onClick={saveHandDeckState(adaptToFullState(playPokeball), drawState)}
//           disabled={!hasPokeball}
//         >
//           Use PokeBall
//         </Button>
//         <Button
//           onClick={saveHandDeckState(
//             adaptToFullState(playProfessorsResearch),
//             drawState,
//           )}
//           disabled={!hasProfResearch}
//         >
//           Use Professor's Research
//         </Button>
//         <Button
//           onClick={saveHandDeckState(
//             adaptToFullState(resetDeckAndHand),
//             originalDeck,
//           )}
//           disabled={handSize == 0}
//         >
//           Reset
//         </Button>
//       </div>
//       <div className="w-full flex flex-row flex-wrap">
//         <PokeCardsContainer width={8}>
//           {drawState.hand.map((card) => {
//             return (
//               <PokeCardDisplay
//                 key={card.data?.id ?? card.cardType}
//                 card={card}
//               />
//             )
//           })}
//         </PokeCardsContainer>
//       </div>
//     </div>
//   )
// }

// export default Hand

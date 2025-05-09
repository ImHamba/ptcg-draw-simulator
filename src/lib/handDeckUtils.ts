import { usePokeball, useProfessorsResearch } from './cardEffects'
import {
  basicPokemonFilter,
  otherCardFilter,
  pokeballFilter,
} from './cardFilters'
import { FIRST_HAND_SIZE, MAX_DECK_SIZE } from './constants'

import {
  conditionalListItem,
  getRandomInt,
  isSameCard,
  sum,
  type CardFilter,
  type MultiPokeCard,
  type PokeCard,
} from './utils'

export type MultiCardWithCumuCount = MultiPokeCard & { cumuCount: number }

export const drawFromDeck = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
  filter?: CardFilter,
) => {
  if (deck.length === 0) {
    throw Error(`Tried to draw from empty deck.`)
  }

  // calculate cumulative counts of cards through the deck
  const deckWithCumuCounts = deck.reduce((acc, card) => {
    const includeCard = filter?.(card) ?? true
    const previousCount = acc.at(-1)?.cumuCount ?? 0

    // if cumulative count only increments for included cards, then they won't
    // be able to be selected later on
    const cumuCount = previousCount + (includeCard ? card.count : 0)
    return [...acc, { ...card, cumuCount: cumuCount }]
  }, [] as MultiCardWithCumuCount[])

  // pick a random number within the size of the deck
  const deckSize = deckWithCumuCounts.at(-1)?.cumuCount ?? 0
  const drawIndex = getRandomInt(deckSize)

  // extract the card corresponding to the draw index and decrement the count of that card
  const { drawnCard, newDeck } = deckWithCumuCounts.reduce(
    (acc, card) => {
      if (
        acc.drawnCard === null &&
        (acc.newDeck.at(-1)?.cumuCount ?? 0) <= drawIndex &&
        drawIndex < card.cumuCount
      ) {
        const newCount = card.count - 1
        return {
          drawnCard: card,
          newDeck: [
            ...acc.newDeck,
            // remove card from deck if count reaches 0
            ...conditionalListItem({ ...card, count: newCount }, newCount > 0),
          ],
        }
      }

      return { drawnCard: acc.drawnCard, newDeck: [...acc.newDeck, card] }
    },
    {
      drawnCard: null as PokeCard | null,
      newDeck: [] as MultiCardWithCumuCount[],
    },
  )

  if (!drawnCard) {
    throw Error(
      `Error drawing card from deck:\ndraw index: ${drawIndex}\ndeck: ${JSON.stringify(deck, null, 2)}`,
    )
  }

  // increment the drawn card in hand if its already held, otherwise append it to the end
  let cardAlreadyInHand = false
  const incrementedHand = hand.map((handCard) => {
    if (isSameCard(drawnCard, handCard)) {
      cardAlreadyInHand = true
      return { ...handCard, count: handCard.count + 1 }
    }

    return handCard
  })

  const newHand = cardAlreadyInHand
    ? incrementedHand
    : [...hand, { ...drawnCard, count: 1 }]

  return { newDeck, newHand, drawnCard }
}

export const drawMany = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
  numberOfCards: number = 1,
  filter?: CardFilter,
) => {
  const arr: number[] = Array(numberOfCards).fill(0)
  return arr.reduce(
    ({ newHand, newDeck, drawnCards }, _) => {
      const drawResult = drawFromDeck(newHand, newDeck, filter)
      return {
        ...drawResult,
        drawnCards: [...drawnCards, drawResult.drawnCard],
      }
    },
    {
      newDeck: deck,
      newHand: hand,
      drawnCards: [] as PokeCard[],
    },
  )
}

export const drawFirstHand = (deck: MultiPokeCard[]) => {
  if (!deck.find(basicPokemonFilter)) {
    throw Error('Tried to draw first hand from deck without basics.')
  }

  let newHand: MultiPokeCard[] = []
  let newDeck: MultiPokeCard[] = deck

  while (!newHand.some(basicPokemonFilter)) {
    newHand = []

    const drawResult = drawMany(newHand, deck, FIRST_HAND_SIZE)
    newHand = drawResult.newHand
    newDeck = drawResult.newDeck
  }

  return { newHand, newDeck }
}

export const decrementCardByCondition = (
  cards: MultiPokeCard[],
  condition: CardFilter,
) => {
  const cardToRemove = cards.find(condition)

  if (!cardToRemove) {
    return cards
  }

  return cardToRemove.count <= 1
    ? // remove card entirely if only 1 copy
      cards.filter((card) => !condition(card))
    : // if many of the card, decrement count
      cards.map((card) =>
        condition(card) ? { ...card, count: card.count - 1 } : card,
      )
}

export const incrementCard = (
  cards: MultiPokeCard[],
  card: PokeCard,
): MultiPokeCard[] => {
  const hasCardAlready = cards.find((c) => isSameCard(c, card))

  return hasCardAlready
    ? cards.map((c) => {
        return c === hasCardAlready ? { ...c, count: c.count + 1 } : c
      })
    : [...cards, { ...card, count: 1 }]
}
export const decrementCard = (
  cards: MultiPokeCard[],
  card: PokeCard,
): MultiPokeCard[] => {
  const hasCardAlready = cards.find((c) => isSameCard(c, card))

  if (!hasCardAlready) {
    return cards
  }

  return hasCardAlready?.count <= 1
    ? cards.filter((c) => c !== hasCardAlready)
    : cards.map((c) =>
        c === hasCardAlready ? { ...c, count: c.count - 1 } : c,
      )
}

export const sumCardCount = (cards: MultiPokeCard[], filter?: CardFilter) => {
  const filteredCards = filter ? cards.filter(filter) : cards
  return sum(filteredCards.map((card) => card.count))
}

export const drawBasic = (hand: MultiPokeCard[], deck: MultiPokeCard[]) => {
  const basicPokemonInDeck = sumCardCount(deck, basicPokemonFilter)
  return drawMany(
    hand,
    deck,
    // draw 1 if the deck has it
    Math.min(1, basicPokemonInDeck),
    basicPokemonFilter,
  )
}

const addCardToCardList = (
  card: PokeCard,
  cardList: MultiPokeCard[],
  numberToAdd: number,
) => {
  const cardListHasCardAlready = cardList.some((listCard) =>
    isSameCard(listCard, card),
  )

  // if card already in card list, increment its count
  if (cardListHasCardAlready) {
    return cardList.map((listCard) =>
      isSameCard(listCard, card)
        ? { ...listCard, count: listCard.count + numberToAdd }
        : listCard,
    )
  }

  // otherwise add it
  return [...cardList, { ...card, count: numberToAdd }]
}

export const addCardToDeck = (
  card: PokeCard,
  deck: MultiPokeCard[],
  originalDeck: MultiPokeCard[],
  numberToAdd = 1,
) => {
  return {
    newOriginalDeck: fillDeck(
      addCardToCardList(card, originalDeck, numberToAdd),
    ),
    newDeck: fillDeck(
      addCardToCardList(card, deck, numberToAdd),
      sumCardCount(deck),
    ),
  }
}

export const fillDeck = (
  deck: MultiPokeCard[],
  targetSize = MAX_DECK_SIZE,
): MultiPokeCard[] => {
  const withoutOther = deck.filter((card) => !otherCardFilter(card))
  const sizeWithoutOther = sumCardCount(withoutOther)

  // if increasing size, add Other cards
  if (sizeWithoutOther < targetSize) {
    const newDeck: MultiPokeCard[] = [
      ...withoutOther,
      {
        cardType: 'other',
        count: targetSize - sizeWithoutOther,
      },
    ]

    return newDeck
  }
  // if reducing size, remove Other cards
  else if (sizeWithoutOther > targetSize) {
    const other = deck.find(otherCardFilter)
    if (!other) {
      throw Error(
        'Can not resize deck without Other cards to smaller target size.',
      )
    }

    const newDeck: MultiPokeCard[] = [
      ...withoutOther,
      {
        ...other,
        count: other.count - (sizeWithoutOther - targetSize),
      },
    ]

    return newDeck
  }

  return withoutOther
}

export const initialDeck: MultiPokeCard[] = fillDeck([])
;[
  // { cardType: 'basicOther', count: 2 },

  {
    data: {
      id: 'PROMO-007',
      setId: 'PROMO',
      number: '7',
      name: 'Professor’s Research',
      set_code: 'PROMO',
      set_name: 'Promo A',
      rarity: 'Common',
      color: '',
      type: 'Supporter',
      slug: 'promo-7-professors-research',
      has_image: '1',
      has_art: '1',
      dex: '',
      hp: '0',
      stage: 'Supporter',
      prew_stage_name: null,
      attack: null,
      ability: null,
      text: null,
      weakness: null,
      retreat: null,
      rule: 'You may play only 1 Supporter card during your turn.',
      illustrator: 'Naoki Saito',
      props: [
        { name: 'Trainer ID', value: 'HAKASENOKENKYU' },
        { name: 'Card Number', value: 'PROMO-A-007' },
        { name: 'Dupe Reward', value: '10' },
        { name: 'Pack Point', value: '35' },
      ],
      flairs: [
        {
          flairs: [
            {
              name: 'Sparkles Flair: Gold (Cosmetic)',
              slug: 'decoration-sparkles-flair-gold-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
              demands: [
                {
                  name: "Professor's Research",
                  slug: 'professors-research',
                  image:
                    'pokepocket/card-flair-demands/professors-research.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '50',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Diamonds Flair: Orange (Cosmetic)',
              slug: 'decoration-diamonds-flair-orange-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-diamonds-flair-orange-cosmetic.webp',
              demands: [
                {
                  name: "Professor's Research",
                  slug: 'professors-research',
                  image:
                    'pokepocket/card-flair-demands/professors-research.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '75',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Small Stars Flair: Yellow (Cosmetic)',
              slug: 'decoration-small-stars-flair-yellow-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-small-stars-flair-yellow-cosmetic.webp',
              demands: [
                {
                  name: "Professor's Research",
                  slug: 'professors-research',
                  image:
                    'pokepocket/card-flair-demands/professors-research.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '150',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Twinkles Flair: Gold (Cosmetic)',
              slug: 'decoration-twinkles-flair-gold-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-twinkles-flair-gold-cosmetic.webp',
              demands: [
                {
                  name: "Professor's Research",
                  slug: 'professors-research',
                  image:
                    'pokepocket/card-flair-demands/professors-research.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '225',
                },
              ],
              from_date: 1704034800,
            },
          ],
          routeName: 'A',
        },
        {
          flairs: [
            {
              name: 'Sparkles Flair: Gold (Cosmetic)',
              slug: 'decoration-sparkles-flair-gold-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
              demands: [
                {
                  name: "Professor's Research",
                  slug: 'professors-research',
                  image:
                    'pokepocket/card-flair-demands/professors-research.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '50',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Small Stars Flair: Yellow (Cosmetic)',
              slug: 'decoration-small-stars-flair-yellow-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-small-stars-flair-yellow-cosmetic.webp',
              demands: [
                {
                  name: "Professor's Research",
                  slug: 'professors-research',
                  image:
                    'pokepocket/card-flair-demands/professors-research.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '75',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Twinkles Flair: Gold (Cosmetic)',
              slug: 'decoration-twinkles-flair-gold-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-twinkles-flair-gold-cosmetic.webp',
              demands: [
                {
                  name: "Professor's Research",
                  slug: 'professors-research',
                  image:
                    'pokepocket/card-flair-demands/professors-research.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '150',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Diamonds Flair: Orange (Cosmetic)',
              slug: 'decoration-diamonds-flair-orange-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-diamonds-flair-orange-cosmetic.webp',
              demands: [
                {
                  name: "Professor's Research",
                  slug: 'professors-research',
                  image:
                    'pokepocket/card-flair-demands/professors-research.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '225',
                },
              ],
              from_date: 1704034800,
            },
          ],
          routeName: 'B',
        },
        {
          flairs: [
            {
              name: 'Sparkles Flair: Gold (Cosmetic)',
              slug: 'decoration-sparkles-flair-gold-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
              demands: [
                {
                  name: "Professor's Research",
                  slug: 'professors-research',
                  image:
                    'pokepocket/card-flair-demands/professors-research.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '50',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Twinkles Flair: Gold (Cosmetic)',
              slug: 'decoration-twinkles-flair-gold-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-twinkles-flair-gold-cosmetic.webp',
              demands: [
                {
                  name: "Professor's Research",
                  slug: 'professors-research',
                  image:
                    'pokepocket/card-flair-demands/professors-research.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '75',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Diamonds Flair: Orange (Cosmetic)',
              slug: 'decoration-diamonds-flair-orange-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-diamonds-flair-orange-cosmetic.webp',
              demands: [
                {
                  name: "Professor's Research",
                  slug: 'professors-research',
                  image:
                    'pokepocket/card-flair-demands/professors-research.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '150',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Small Stars Flair: Yellow (Cosmetic)',
              slug: 'decoration-small-stars-flair-yellow-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-small-stars-flair-yellow-cosmetic.webp',
              demands: [
                {
                  name: "Professor's Research",
                  slug: 'professors-research',
                  image:
                    'pokepocket/card-flair-demands/professors-research.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '225',
                },
              ],
              from_date: 1704034800,
            },
          ],
          routeName: 'C',
        },
      ],
      price: '0',
      price_date: '0',
      foilPrice: '0',
      deltaPrice: '0',
      deltaFoilPrice: '0',
      delta7dPrice: '0',
      delta7dPriceFoil: '0',
    },
    count: 2,
  },
  {
    data: {
      id: 'A2b-111',
      setId: 'A2b',
      number: '111',
      name: 'Poké Ball',
      set_code: 'A2b',
      set_name: 'Shining Revelry',
      rarity: 'Crown Rare',
      color: '',
      type: null,
      slug: 'a2b-111-poke-ball',
      has_image: '1',
      has_art: '0',
      dex: 'A2b',
      hp: '0',
      stage: 'Item',
      prew_stage_name: null,
      attack: null,
      ability: null,
      text: null,
      weakness: null,
      retreat: null,
      rule: 'You may play any number of Item cards during your turn.',
      illustrator: 'Toyste Beach',
      props: null,
      flairs: null,
      price: '0',
      price_date: '0',
      foilPrice: '0',
      deltaPrice: '0',
      deltaFoilPrice: '0',
      delta7dPrice: '0',
      delta7dPriceFoil: '0',
    },
    count: 2,
  },
  {
    data: {
      id: 'A1-089',
      setId: 'A1',
      number: '89',
      name: 'Greninja',
      set_code: 'A1',
      set_name: 'Genetic Apex',
      rarity: 'Rare',
      color: 'Water',
      type: 'Pokemon',
      slug: 'a1-89-greninja',
      has_image: '1',
      has_art: '1',
      dex: 'A1_2',
      hp: '120',
      stage: 'Stage 2',
      prew_stage_name: 'Frogadier',
      attack: [{ info: '{WC} Mist Slash 60', effect: '' }],
      ability: [
        {
          info: 'Water Shuriken',
          effect:
            'Once during your turn, you may do 20 damage to 1 of your opponent’s Pokémon.',
        },
      ],
      text: 'It creates throwing stars out of compressed water. <br />When it spins them and throws them at high speed, <br />these stars can split metal in two.',
      weakness: 'Lightning',
      retreat: '1',
      rule: null,
      illustrator: '5ban Graphics',
      props: [
        { name: 'Pokémon ID', value: 'GEKKOUGA' },
        { name: 'Card Number', value: 'A1-089' },
        { name: 'Dupe Reward', value: '100' },
        { name: 'Pack Point', value: '150' },
      ],
      flairs: [
        {
          flairs: [
            {
              name: 'Sparkles Flair: Gold (Cosmetic)',
              slug: 'decoration-sparkles-flair-gold-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
              demands: [
                {
                  name: 'Greninja',
                  slug: 'greninja',
                  image: 'pokepocket/card-flair-demands/greninja.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '360',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Water Energy Flair (Cosmetic)',
              slug: 'decoration-water-energy-flair-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-water-energy-flair-cosmetic.webp',
              demands: [
                {
                  name: 'Greninja',
                  slug: 'greninja',
                  image: 'pokepocket/card-flair-demands/greninja.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '540',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Sparkles Flair: Gold (Cosmetic)',
              prerequisite_count: '1',
            },
            {
              name: 'Big Rings Flair: Blue (Battle)',
              slug: 'battle-effect-big-rings-flair-blue-battle',
              type: 'Battle Effect',
              count: '1',
              image:
                'pokepocket/card-flairs/battle-effect-big-rings-flair-blue-battle.webp',
              demands: [
                {
                  name: 'Greninja',
                  slug: 'greninja',
                  image: 'pokepocket/card-flair-demands/greninja.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '1,080',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Water Energy Flair (Cosmetic)',
              prerequisite_count: '1',
            },
            {
              name: 'Mini Triangles Flair: Blue (Battle)',
              slug: 'battle-effect-mini-triangles-flair-blue-battle',
              type: 'Battle Effect',
              count: '1',
              image:
                'pokepocket/card-flairs/battle-effect-mini-triangles-flair-blue-battle.webp',
              demands: [
                {
                  name: 'Greninja',
                  slug: 'greninja',
                  image: 'pokepocket/card-flair-demands/greninja.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '1,620',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Big Rings Flair: Blue (Battle)',
              prerequisite_count: '1',
            },
          ],
          routeName: 'A',
        },
        {
          flairs: [
            {
              name: 'Sparkles Flair: Gold (Cosmetic)',
              slug: 'decoration-sparkles-flair-gold-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
              demands: [
                {
                  name: 'Greninja',
                  slug: 'greninja',
                  image: 'pokepocket/card-flair-demands/greninja.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '360',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Big Rings Flair: Blue (Battle)',
              slug: 'battle-effect-big-rings-flair-blue-battle',
              type: 'Battle Effect',
              count: '1',
              image:
                'pokepocket/card-flairs/battle-effect-big-rings-flair-blue-battle.webp',
              demands: [
                {
                  name: 'Greninja',
                  slug: 'greninja',
                  image: 'pokepocket/card-flair-demands/greninja.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '540',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Sparkles Flair: Gold (Cosmetic)',
              prerequisite_count: '1',
            },
            {
              name: 'Mini Triangles Flair: Blue (Battle)',
              slug: 'battle-effect-mini-triangles-flair-blue-battle',
              type: 'Battle Effect',
              count: '1',
              image:
                'pokepocket/card-flairs/battle-effect-mini-triangles-flair-blue-battle.webp',
              demands: [
                {
                  name: 'Greninja',
                  slug: 'greninja',
                  image: 'pokepocket/card-flair-demands/greninja.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '1,080',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Big Rings Flair: Blue (Battle)',
              prerequisite_count: '1',
            },
            {
              name: 'Water Energy Flair (Cosmetic)',
              slug: 'decoration-water-energy-flair-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-water-energy-flair-cosmetic.webp',
              demands: [
                {
                  name: 'Greninja',
                  slug: 'greninja',
                  image: 'pokepocket/card-flair-demands/greninja.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '1,620',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Mini Triangles Flair: Blue (Battle)',
              prerequisite_count: '1',
            },
          ],
          routeName: 'B',
        },
        {
          flairs: [
            {
              name: 'Sparkles Flair: Gold (Cosmetic)',
              slug: 'decoration-sparkles-flair-gold-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
              demands: [
                {
                  name: 'Greninja',
                  slug: 'greninja',
                  image: 'pokepocket/card-flair-demands/greninja.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '360',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Mini Triangles Flair: Blue (Battle)',
              slug: 'battle-effect-mini-triangles-flair-blue-battle',
              type: 'Battle Effect',
              count: '1',
              image:
                'pokepocket/card-flairs/battle-effect-mini-triangles-flair-blue-battle.webp',
              demands: [
                {
                  name: 'Greninja',
                  slug: 'greninja',
                  image: 'pokepocket/card-flair-demands/greninja.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '540',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Sparkles Flair: Gold (Cosmetic)',
              prerequisite_count: '1',
            },
            {
              name: 'Water Energy Flair (Cosmetic)',
              slug: 'decoration-water-energy-flair-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-water-energy-flair-cosmetic.webp',
              demands: [
                {
                  name: 'Greninja',
                  slug: 'greninja',
                  image: 'pokepocket/card-flair-demands/greninja.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '1,080',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Mini Triangles Flair: Blue (Battle)',
              prerequisite_count: '1',
            },
            {
              name: 'Big Rings Flair: Blue (Battle)',
              slug: 'battle-effect-big-rings-flair-blue-battle',
              type: 'Battle Effect',
              count: '1',
              image:
                'pokepocket/card-flairs/battle-effect-big-rings-flair-blue-battle.webp',
              demands: [
                {
                  name: 'Greninja',
                  slug: 'greninja',
                  image: 'pokepocket/card-flair-demands/greninja.webp',
                  amount: '1',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '1,620',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Water Energy Flair (Cosmetic)',
              prerequisite_count: '1',
            },
          ],
          routeName: 'C',
        },
      ],
      price: '0',
      price_date: '0',
      foilPrice: '0',
      deltaPrice: '0',
      deltaFoilPrice: '0',
      delta7dPrice: '0',
      delta7dPriceFoil: '0',
    },
    count: 2,
  },
  {
    data: {
      id: 'A1-087',
      setId: 'A1',
      number: '87',
      name: 'Froakie',
      set_code: 'A1',
      set_name: 'Genetic Apex',
      rarity: 'Common',
      color: 'Water',
      type: 'Pokemon',
      slug: 'a1-87-froakie',
      has_image: '1',
      has_art: '1',
      dex: 'A1_2',
      hp: '60',
      stage: 'Basic',
      prew_stage_name: null,
      attack: [{ info: '{C} Flop 10', effect: '' }],
      ability: [],
      text: 'It secretes flexible bubbles from its chest and back.<br />The bubbles reduce the damage it would otherwise<br />take when attacked.',
      weakness: 'Lightning',
      retreat: '1',
      rule: null,
      illustrator: 'Aya Kusube',
      props: [
        { name: 'Pokémon ID', value: 'KEROMATSU' },
        { name: 'Card Number', value: 'A1-087' },
        { name: 'Dupe Reward', value: '10' },
        { name: 'Pack Point', value: '35' },
      ],
      flairs: [
        {
          flairs: [
            {
              name: 'Sparkles Flair: Gold (Cosmetic)',
              slug: 'decoration-sparkles-flair-gold-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
              demands: [
                {
                  name: 'Froakie',
                  slug: 'froakie',
                  image: 'pokepocket/card-flair-demands/froakie.webp',
                  amount: '3',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '50',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Ripples Flair: Light blue (Cosmetic)',
              slug: 'decoration-ripples-flair-light-blue-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-ripples-flair-light-blue-cosmetic.webp',
              demands: [
                {
                  name: 'Froakie',
                  slug: 'froakie',
                  image: 'pokepocket/card-flair-demands/froakie.webp',
                  amount: '3',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '75',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Sparkles Flair: Gold (Cosmetic)',
              prerequisite_count: '1',
            },
            {
              name: 'Water Energy Flair (Cosmetic)',
              slug: 'decoration-water-energy-flair-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-water-energy-flair-cosmetic.webp',
              demands: [
                {
                  name: 'Froakie',
                  slug: 'froakie',
                  image: 'pokepocket/card-flair-demands/froakie.webp',
                  amount: '3',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '150',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Ripples Flair: Light blue (Cosmetic)',
              prerequisite_count: '1',
            },
            {
              name: 'Star Outlines Flair: Yellow (Battle)',
              slug: 'battle-effect-star-outlines-flair-yellow-battle',
              type: 'Battle Effect',
              count: '1',
              image:
                'pokepocket/card-flairs/battle-effect-star-outlines-flair-yellow-battle.webp',
              demands: [
                {
                  name: 'Froakie',
                  slug: 'froakie',
                  image: 'pokepocket/card-flair-demands/froakie.webp',
                  amount: '3',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '225',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Water Energy Flair (Cosmetic)',
              prerequisite_count: '1',
            },
          ],
          routeName: 'A',
        },
        {
          flairs: [
            {
              name: 'Sparkles Flair: Gold (Cosmetic)',
              slug: 'decoration-sparkles-flair-gold-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
              demands: [
                {
                  name: 'Froakie',
                  slug: 'froakie',
                  image: 'pokepocket/card-flair-demands/froakie.webp',
                  amount: '3',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '50',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Water Energy Flair (Cosmetic)',
              slug: 'decoration-water-energy-flair-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-water-energy-flair-cosmetic.webp',
              demands: [
                {
                  name: 'Froakie',
                  slug: 'froakie',
                  image: 'pokepocket/card-flair-demands/froakie.webp',
                  amount: '3',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '75',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Sparkles Flair: Gold (Cosmetic)',
              prerequisite_count: '1',
            },
            {
              name: 'Star Outlines Flair: Yellow (Battle)',
              slug: 'battle-effect-star-outlines-flair-yellow-battle',
              type: 'Battle Effect',
              count: '1',
              image:
                'pokepocket/card-flairs/battle-effect-star-outlines-flair-yellow-battle.webp',
              demands: [
                {
                  name: 'Froakie',
                  slug: 'froakie',
                  image: 'pokepocket/card-flair-demands/froakie.webp',
                  amount: '3',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '150',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Water Energy Flair (Cosmetic)',
              prerequisite_count: '1',
            },
            {
              name: 'Ripples Flair: Light blue (Cosmetic)',
              slug: 'decoration-ripples-flair-light-blue-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-ripples-flair-light-blue-cosmetic.webp',
              demands: [
                {
                  name: 'Froakie',
                  slug: 'froakie',
                  image: 'pokepocket/card-flair-demands/froakie.webp',
                  amount: '3',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '225',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Star Outlines Flair: Yellow (Battle)',
              prerequisite_count: '1',
            },
          ],
          routeName: 'B',
        },
        {
          flairs: [
            {
              name: 'Sparkles Flair: Gold (Cosmetic)',
              slug: 'decoration-sparkles-flair-gold-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
              demands: [
                {
                  name: 'Froakie',
                  slug: 'froakie',
                  image: 'pokepocket/card-flair-demands/froakie.webp',
                  amount: '3',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '50',
                },
              ],
              from_date: 1704034800,
            },
            {
              name: 'Star Outlines Flair: Yellow (Battle)',
              slug: 'battle-effect-star-outlines-flair-yellow-battle',
              type: 'Battle Effect',
              count: '1',
              image:
                'pokepocket/card-flairs/battle-effect-star-outlines-flair-yellow-battle.webp',
              demands: [
                {
                  name: 'Froakie',
                  slug: 'froakie',
                  image: 'pokepocket/card-flair-demands/froakie.webp',
                  amount: '3',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '75',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Sparkles Flair: Gold (Cosmetic)',
              prerequisite_count: '1',
            },
            {
              name: 'Ripples Flair: Light blue (Cosmetic)',
              slug: 'decoration-ripples-flair-light-blue-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-ripples-flair-light-blue-cosmetic.webp',
              demands: [
                {
                  name: 'Froakie',
                  slug: 'froakie',
                  image: 'pokepocket/card-flair-demands/froakie.webp',
                  amount: '3',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '150',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Star Outlines Flair: Yellow (Battle)',
              prerequisite_count: '1',
            },
            {
              name: 'Water Energy Flair (Cosmetic)',
              slug: 'decoration-water-energy-flair-cosmetic',
              type: 'Decoration',
              count: '1',
              image:
                'pokepocket/card-flairs/decoration-water-energy-flair-cosmetic.webp',
              demands: [
                {
                  name: 'Froakie',
                  slug: 'froakie',
                  image: 'pokepocket/card-flair-demands/froakie.webp',
                  amount: '3',
                },
                {
                  name: 'Shinedust',
                  slug: 'shinedust',
                  image: 'pokepocket/card-flair-demands/shinedust.webp',
                  amount: '225',
                },
              ],
              from_date: 1704034800,
              prerequisite_name: 'Ripples Flair: Light blue (Cosmetic)',
              prerequisite_count: '1',
            },
          ],
          routeName: 'C',
        },
      ],
      price: '0',
      price_date: '0',
      foilPrice: '0',
      deltaPrice: '0',
      deltaFoilPrice: '0',
      delta7dPrice: '0',
      delta7dPriceFoil: '0',
    },
    count: 2,
  },
  {
    data: {
      id: 'A3-144',
      setId: 'A3',
      number: '144',
      name: 'Rare Candy',
      set_code: 'A3',
      set_name: 'Celestial Guardians',
      rarity: 'Uncommon',
      color: null,
      type: null,
      slug: 'a3-144-rare-candy',
      has_image: '1',
      has_art: '0',
      dex: 'A3_1,A3_2',
      hp: null,
      stage: 'Item',
      prew_stage_name: null,
      attack: null,
      ability: null,
      text: null,
      weakness: null,
      retreat: null,
      rule: 'You may play any number of Item cards during your turn.',
      illustrator: 'Toyste Beach',
      props: null,
      flairs: null,
      price: '0',
      price_date: '0',
      foilPrice: '0',
      deltaPrice: '0',
      deltaFoilPrice: '0',
      delta7dPrice: '0',
      delta7dPriceFoil: '0',
    },
    count: 2,
  },
]

export type TargetHands = Record<string, MultiPokeCard[]>
export const initialTargetHands: TargetHands = {}
// {
//   '01b6dca2-4477-42fa-9974-5a44d6885c99': [
//     {
//       data: {
//         id: 'A1-089',
//         setId: 'A1',
//         number: '89',
//         name: 'Greninja',
//         set_code: 'A1',
//         set_name: 'Genetic Apex',
//         rarity: 'Rare',
//         color: 'Water',
//         type: 'Pokemon',
//         slug: 'a1-89-greninja',
//         has_image: '1',
//         has_art: '1',
//         dex: 'A1_2',
//         hp: '120',
//         stage: 'Stage 2',
//         prew_stage_name: 'Frogadier',
//         attack: [{ info: '{WC} Mist Slash 60', effect: '' }],
//         ability: [
//           {
//             info: 'Water Shuriken',
//             effect:
//               'Once during your turn, you may do 20 damage to 1 of your opponent’s Pokémon.',
//           },
//         ],
//         text: 'It creates throwing stars out of compressed water. <br />When it spins them and throws them at high speed, <br />these stars can split metal in two.',
//         weakness: 'Lightning',
//         retreat: '1',
//         rule: null,
//         illustrator: '5ban Graphics',
//         props: [
//           { name: 'Pokémon ID', value: 'GEKKOUGA' },
//           { name: 'Card Number', value: 'A1-089' },
//           { name: 'Dupe Reward', value: '100' },
//           { name: 'Pack Point', value: '150' },
//         ],
//         flairs: [
//           {
//             flairs: [
//               {
//                 name: 'Sparkles Flair: Gold (Cosmetic)',
//                 slug: 'decoration-sparkles-flair-gold-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Greninja',
//                     slug: 'greninja',
//                     image: 'pokepocket/card-flair-demands/greninja.webp',
//                     amount: '1',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '360',
//                   },
//                 ],
//                 from_date: 1704034800,
//               },
//               {
//                 name: 'Water Energy Flair (Cosmetic)',
//                 slug: 'decoration-water-energy-flair-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-water-energy-flair-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Greninja',
//                     slug: 'greninja',
//                     image: 'pokepocket/card-flair-demands/greninja.webp',
//                     amount: '1',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '540',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Sparkles Flair: Gold (Cosmetic)',
//                 prerequisite_count: '1',
//               },
//               {
//                 name: 'Big Rings Flair: Blue (Battle)',
//                 slug: 'battle-effect-big-rings-flair-blue-battle',
//                 type: 'Battle Effect',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/battle-effect-big-rings-flair-blue-battle.webp',
//                 demands: [
//                   {
//                     name: 'Greninja',
//                     slug: 'greninja',
//                     image: 'pokepocket/card-flair-demands/greninja.webp',
//                     amount: '1',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '1,080',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Water Energy Flair (Cosmetic)',
//                 prerequisite_count: '1',
//               },
//               {
//                 name: 'Mini Triangles Flair: Blue (Battle)',
//                 slug: 'battle-effect-mini-triangles-flair-blue-battle',
//                 type: 'Battle Effect',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/battle-effect-mini-triangles-flair-blue-battle.webp',
//                 demands: [
//                   {
//                     name: 'Greninja',
//                     slug: 'greninja',
//                     image: 'pokepocket/card-flair-demands/greninja.webp',
//                     amount: '1',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '1,620',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Big Rings Flair: Blue (Battle)',
//                 prerequisite_count: '1',
//               },
//             ],
//             routeName: 'A',
//           },
//           {
//             flairs: [
//               {
//                 name: 'Sparkles Flair: Gold (Cosmetic)',
//                 slug: 'decoration-sparkles-flair-gold-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Greninja',
//                     slug: 'greninja',
//                     image: 'pokepocket/card-flair-demands/greninja.webp',
//                     amount: '1',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '360',
//                   },
//                 ],
//                 from_date: 1704034800,
//               },
//               {
//                 name: 'Big Rings Flair: Blue (Battle)',
//                 slug: 'battle-effect-big-rings-flair-blue-battle',
//                 type: 'Battle Effect',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/battle-effect-big-rings-flair-blue-battle.webp',
//                 demands: [
//                   {
//                     name: 'Greninja',
//                     slug: 'greninja',
//                     image: 'pokepocket/card-flair-demands/greninja.webp',
//                     amount: '1',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '540',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Sparkles Flair: Gold (Cosmetic)',
//                 prerequisite_count: '1',
//               },
//               {
//                 name: 'Mini Triangles Flair: Blue (Battle)',
//                 slug: 'battle-effect-mini-triangles-flair-blue-battle',
//                 type: 'Battle Effect',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/battle-effect-mini-triangles-flair-blue-battle.webp',
//                 demands: [
//                   {
//                     name: 'Greninja',
//                     slug: 'greninja',
//                     image: 'pokepocket/card-flair-demands/greninja.webp',
//                     amount: '1',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '1,080',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Big Rings Flair: Blue (Battle)',
//                 prerequisite_count: '1',
//               },
//               {
//                 name: 'Water Energy Flair (Cosmetic)',
//                 slug: 'decoration-water-energy-flair-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-water-energy-flair-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Greninja',
//                     slug: 'greninja',
//                     image: 'pokepocket/card-flair-demands/greninja.webp',
//                     amount: '1',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '1,620',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Mini Triangles Flair: Blue (Battle)',
//                 prerequisite_count: '1',
//               },
//             ],
//             routeName: 'B',
//           },
//           {
//             flairs: [
//               {
//                 name: 'Sparkles Flair: Gold (Cosmetic)',
//                 slug: 'decoration-sparkles-flair-gold-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Greninja',
//                     slug: 'greninja',
//                     image: 'pokepocket/card-flair-demands/greninja.webp',
//                     amount: '1',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '360',
//                   },
//                 ],
//                 from_date: 1704034800,
//               },
//               {
//                 name: 'Mini Triangles Flair: Blue (Battle)',
//                 slug: 'battle-effect-mini-triangles-flair-blue-battle',
//                 type: 'Battle Effect',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/battle-effect-mini-triangles-flair-blue-battle.webp',
//                 demands: [
//                   {
//                     name: 'Greninja',
//                     slug: 'greninja',
//                     image: 'pokepocket/card-flair-demands/greninja.webp',
//                     amount: '1',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '540',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Sparkles Flair: Gold (Cosmetic)',
//                 prerequisite_count: '1',
//               },
//               {
//                 name: 'Water Energy Flair (Cosmetic)',
//                 slug: 'decoration-water-energy-flair-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-water-energy-flair-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Greninja',
//                     slug: 'greninja',
//                     image: 'pokepocket/card-flair-demands/greninja.webp',
//                     amount: '1',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '1,080',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Mini Triangles Flair: Blue (Battle)',
//                 prerequisite_count: '1',
//               },
//               {
//                 name: 'Big Rings Flair: Blue (Battle)',
//                 slug: 'battle-effect-big-rings-flair-blue-battle',
//                 type: 'Battle Effect',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/battle-effect-big-rings-flair-blue-battle.webp',
//                 demands: [
//                   {
//                     name: 'Greninja',
//                     slug: 'greninja',
//                     image: 'pokepocket/card-flair-demands/greninja.webp',
//                     amount: '1',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '1,620',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Water Energy Flair (Cosmetic)',
//                 prerequisite_count: '1',
//               },
//             ],
//             routeName: 'C',
//           },
//         ],
//         price: '0',
//         price_date: '0',
//         foilPrice: '0',
//         deltaPrice: '0',
//         deltaFoilPrice: '0',
//         delta7dPrice: '0',
//         delta7dPriceFoil: '0',
//       },
//       count: 1,
//     },
//     {
//       data: {
//         id: 'A1-087',
//         setId: 'A1',
//         number: '87',
//         name: 'Froakie',
//         set_code: 'A1',
//         set_name: 'Genetic Apex',
//         rarity: 'Common',
//         color: 'Water',
//         type: 'Pokemon',
//         slug: 'a1-87-froakie',
//         has_image: '1',
//         has_art: '1',
//         dex: 'A1_2',
//         hp: '60',
//         stage: 'Basic',
//         prew_stage_name: null,
//         attack: [{ info: '{C} Flop 10', effect: '' }],
//         ability: [],
//         text: 'It secretes flexible bubbles from its chest and back.<br />The bubbles reduce the damage it would otherwise<br />take when attacked.',
//         weakness: 'Lightning',
//         retreat: '1',
//         rule: null,
//         illustrator: 'Aya Kusube',
//         props: [
//           { name: 'Pokémon ID', value: 'KEROMATSU' },
//           { name: 'Card Number', value: 'A1-087' },
//           { name: 'Dupe Reward', value: '10' },
//           { name: 'Pack Point', value: '35' },
//         ],
//         flairs: [
//           {
//             flairs: [
//               {
//                 name: 'Sparkles Flair: Gold (Cosmetic)',
//                 slug: 'decoration-sparkles-flair-gold-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Froakie',
//                     slug: 'froakie',
//                     image: 'pokepocket/card-flair-demands/froakie.webp',
//                     amount: '3',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '50',
//                   },
//                 ],
//                 from_date: 1704034800,
//               },
//               {
//                 name: 'Ripples Flair: Light blue (Cosmetic)',
//                 slug: 'decoration-ripples-flair-light-blue-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-ripples-flair-light-blue-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Froakie',
//                     slug: 'froakie',
//                     image: 'pokepocket/card-flair-demands/froakie.webp',
//                     amount: '3',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '75',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Sparkles Flair: Gold (Cosmetic)',
//                 prerequisite_count: '1',
//               },
//               {
//                 name: 'Water Energy Flair (Cosmetic)',
//                 slug: 'decoration-water-energy-flair-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-water-energy-flair-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Froakie',
//                     slug: 'froakie',
//                     image: 'pokepocket/card-flair-demands/froakie.webp',
//                     amount: '3',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '150',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Ripples Flair: Light blue (Cosmetic)',
//                 prerequisite_count: '1',
//               },
//               {
//                 name: 'Star Outlines Flair: Yellow (Battle)',
//                 slug: 'battle-effect-star-outlines-flair-yellow-battle',
//                 type: 'Battle Effect',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/battle-effect-star-outlines-flair-yellow-battle.webp',
//                 demands: [
//                   {
//                     name: 'Froakie',
//                     slug: 'froakie',
//                     image: 'pokepocket/card-flair-demands/froakie.webp',
//                     amount: '3',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '225',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Water Energy Flair (Cosmetic)',
//                 prerequisite_count: '1',
//               },
//             ],
//             routeName: 'A',
//           },
//           {
//             flairs: [
//               {
//                 name: 'Sparkles Flair: Gold (Cosmetic)',
//                 slug: 'decoration-sparkles-flair-gold-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Froakie',
//                     slug: 'froakie',
//                     image: 'pokepocket/card-flair-demands/froakie.webp',
//                     amount: '3',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '50',
//                   },
//                 ],
//                 from_date: 1704034800,
//               },
//               {
//                 name: 'Water Energy Flair (Cosmetic)',
//                 slug: 'decoration-water-energy-flair-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-water-energy-flair-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Froakie',
//                     slug: 'froakie',
//                     image: 'pokepocket/card-flair-demands/froakie.webp',
//                     amount: '3',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '75',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Sparkles Flair: Gold (Cosmetic)',
//                 prerequisite_count: '1',
//               },
//               {
//                 name: 'Star Outlines Flair: Yellow (Battle)',
//                 slug: 'battle-effect-star-outlines-flair-yellow-battle',
//                 type: 'Battle Effect',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/battle-effect-star-outlines-flair-yellow-battle.webp',
//                 demands: [
//                   {
//                     name: 'Froakie',
//                     slug: 'froakie',
//                     image: 'pokepocket/card-flair-demands/froakie.webp',
//                     amount: '3',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '150',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Water Energy Flair (Cosmetic)',
//                 prerequisite_count: '1',
//               },
//               {
//                 name: 'Ripples Flair: Light blue (Cosmetic)',
//                 slug: 'decoration-ripples-flair-light-blue-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-ripples-flair-light-blue-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Froakie',
//                     slug: 'froakie',
//                     image: 'pokepocket/card-flair-demands/froakie.webp',
//                     amount: '3',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '225',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Star Outlines Flair: Yellow (Battle)',
//                 prerequisite_count: '1',
//               },
//             ],
//             routeName: 'B',
//           },
//           {
//             flairs: [
//               {
//                 name: 'Sparkles Flair: Gold (Cosmetic)',
//                 slug: 'decoration-sparkles-flair-gold-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-sparkles-flair-gold-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Froakie',
//                     slug: 'froakie',
//                     image: 'pokepocket/card-flair-demands/froakie.webp',
//                     amount: '3',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '50',
//                   },
//                 ],
//                 from_date: 1704034800,
//               },
//               {
//                 name: 'Star Outlines Flair: Yellow (Battle)',
//                 slug: 'battle-effect-star-outlines-flair-yellow-battle',
//                 type: 'Battle Effect',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/battle-effect-star-outlines-flair-yellow-battle.webp',
//                 demands: [
//                   {
//                     name: 'Froakie',
//                     slug: 'froakie',
//                     image: 'pokepocket/card-flair-demands/froakie.webp',
//                     amount: '3',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '75',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Sparkles Flair: Gold (Cosmetic)',
//                 prerequisite_count: '1',
//               },
//               {
//                 name: 'Ripples Flair: Light blue (Cosmetic)',
//                 slug: 'decoration-ripples-flair-light-blue-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-ripples-flair-light-blue-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Froakie',
//                     slug: 'froakie',
//                     image: 'pokepocket/card-flair-demands/froakie.webp',
//                     amount: '3',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '150',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Star Outlines Flair: Yellow (Battle)',
//                 prerequisite_count: '1',
//               },
//               {
//                 name: 'Water Energy Flair (Cosmetic)',
//                 slug: 'decoration-water-energy-flair-cosmetic',
//                 type: 'Decoration',
//                 count: '1',
//                 image:
//                   'pokepocket/card-flairs/decoration-water-energy-flair-cosmetic.webp',
//                 demands: [
//                   {
//                     name: 'Froakie',
//                     slug: 'froakie',
//                     image: 'pokepocket/card-flair-demands/froakie.webp',
//                     amount: '3',
//                   },
//                   {
//                     name: 'Shinedust',
//                     slug: 'shinedust',
//                     image: 'pokepocket/card-flair-demands/shinedust.webp',
//                     amount: '225',
//                   },
//                 ],
//                 from_date: 1704034800,
//                 prerequisite_name: 'Ripples Flair: Light blue (Cosmetic)',
//                 prerequisite_count: '1',
//               },
//             ],
//             routeName: 'C',
//           },
//         ],
//         price: '0',
//         price_date: '0',
//         foilPrice: '0',
//         deltaPrice: '0',
//         deltaFoilPrice: '0',
//         delta7dPrice: '0',
//         delta7dPriceFoil: '0',
//       },
//       count: 1,
//     },
//     {
//       data: {
//         id: 'A3-144',
//         setId: 'A3',
//         number: '144',
//         name: 'Rare Candy',
//         set_code: 'A3',
//         set_name: 'Celestial Guardians',
//         rarity: 'Uncommon',
//         color: null,
//         type: null,
//         slug: 'a3-144-rare-candy',
//         has_image: '1',
//         has_art: '0',
//         dex: 'A3_1,A3_2',
//         hp: null,
//         stage: 'Item',
//         prew_stage_name: null,
//         attack: null,
//         ability: null,
//         text: null,
//         weakness: null,
//         retreat: null,
//         rule: 'You may play any number of Item cards during your turn.',
//         illustrator: 'Toyste Beach',
//         props: null,
//         flairs: null,
//         price: '0',
//         price_date: '0',
//         foilPrice: '0',
//         deltaPrice: '0',
//         deltaFoilPrice: '0',
//         delta7dPrice: '0',
//         delta7dPriceFoil: '0',
//       },
//       count: 1,
//     },
//   ],
// }

export const initialHand: MultiPokeCard[] = []

export const resetDeckAndHand = (originalDeck: MultiPokeCard[]) => {
  return {
    newDeck: originalDeck,
    newHand: initialHand,
  }
}

export const resetOriginalDeck = () => {
  return {
    newDeck: fillDeck([]),
    newOriginalDeck: fillDeck([]),
    newHand: [],
    newTargetHands: {},
  }
}

export const resetAllAndAddCard = (
  card: PokeCard,
  originalDeck: MultiPokeCard[],
) => {
  const { newHand, newDeck } = resetDeckAndHand(originalDeck)
  return {
    ...addCardToDeck(card, newDeck, originalDeck),
    newHand: newHand,
  }
}

export const addTargetCard = (
  card: PokeCard,
  targetHandId: string,
  existingTargetHands: TargetHands,
  numberToAdd = 1,
) => {
  const addTo = existingTargetHands[targetHandId] ?? []

  return {
    newTargetHands: {
      ...existingTargetHands,
      [targetHandId]: addCardToCardList(card, addTo, numberToAdd),
    },
  }
}

type useCard = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
) => {
  newHand: MultiPokeCard[]
  newDeck: MultiPokeCard[]
}

export const useAllCards = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
  useCard: useCard,
  cardFilter: CardFilter,
) => {
  let newHand = hand
  let newDeck = deck
  while (newHand.some(cardFilter)) {
    ;({ newHand, newDeck } = useCard(newHand, newDeck))
  }

  return { newHand, newDeck }
}

export const useSpecialCards = (
  hand: MultiPokeCard[],
  deck: MultiPokeCard[],
) => {
  const { newHand: handAfterPokeball, newDeck: deckAfterPokeball } =
    useAllCards(hand, deck, usePokeball, pokeballFilter)

  // only uses if hand contains a prof research
  const { newHand: handAfterResearch, newDeck: deckAfterResearch } =
    useProfessorsResearch(handAfterPokeball, deckAfterPokeball)

  // TODO: work out why using pokeballs after research reduces chance to get target hand
  // return { newHand: handAfterResearch, newDeck: deckAfterResearch }
  // use pokeball again that might be drawn by prof research
  return useAllCards(
    handAfterResearch,
    deckAfterResearch,
    usePokeball,
    pokeballFilter,
  )
}

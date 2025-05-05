const CARD_SETS_API_URL = 'https://api.dotgg.gg/cgfw/getsets?game=pokepocket'

const CORS_PROXY_URL = 'https://corsproxy.io/?url=' // 'https://api.cors.lol/?url='
export const CARD_DATA_API_URL =
  'https://api.dotgg.gg/cgfw/getcards?game=pokepocket'
export const CARD_DATA_PROXY_URL = CORS_PROXY_URL + CARD_DATA_API_URL

export const CARD_IMG_API_URL =
  'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/pocket/' //'https://static.dotgg.gg/pokepocket/card/'
export const DEFAULT_CARD_IMG_URL = 'cardback.png'
export const BASIC_CARD_IMG_URL = 'basic.png'

// export const fakeCardData = [
//   {
//     id: 'A2-184',
//     setId: 'A2',
//     number: '184',
//     name: 'Mismagius ex',
//     set_code: 'A2',
//     set_name: 'Space-Time Smackdown',
//     rarity: 'Super Rare',
//     color: 'Psychic',
//     type: 'Pokemon',
//     slug: 'a2-184-mismagius-ex',
//     has_image: '1',
//     has_art: '0',
//     dex: 'A2_2',
//     hp: '140',
//     stage: 'Stage 1',
//     prew_stage_name: 'Misdreavus',
//     attack: [
//       {
//         info: '{PP} Magical Delusion 70',
//         effect: "Your opponent's Active Pokémon is now Confused.",
//       },
//     ],
//     ability: [],
//     text: null,
//     weakness: 'Darkness',
//     retreat: '1',
//     rule: 'When your Pokémon \u003Cstrong\u003Eex\u003C/strong\u003E is \u003Cstrong\u003EKnocked Out\u003C/strong\u003E, your opponent gets \u003Cstrong\u003E2\u003C/strong\u003E points.',
//     illustrator: 'PLANETA Tsuji',
//     props: [
//       {
//         name: 'Pokémon ID',
//         value: 'MUMARGI_EX',
//       },
//       {
//         name: 'Card Number',
//         value: 'A2-184',
//       },
//       {
//         name: 'Dupe Reward',
//         value: '870',
//       },
//       {
//         name: 'Pack Point',
//         value: '1,250',
//       },
//     ],
//     flairs: [
//       {
//         flairs: [
//           {
//             name: 'Tiny Twinkles Flair: Yellow (Battle)',
//             slug: 'battle-effect-tiny-twinkles-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-tiny-twinkles-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Big Rings Flair: Purple (Battle)',
//             slug: 'battle-effect-big-rings-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-big-rings-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '2,700',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Star Outlines Flair: Purple (Battle)',
//             slug: 'battle-effect-star-outlines-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-star-outlines-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '5,400',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Mini Triangles Flair: Purple (Battle)',
//             slug: 'battle-effect-mini-triangles-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-mini-triangles-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '8,100',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Special shop ticket',
//             slug: 'item-special-shop-ticket',
//             type: 'Item',
//             count: '5',
//             image: 'pokepocket/card-flairs/item-special-shop-ticket.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Trade Token',
//             slug: 'item-trade-token',
//             type: 'Item',
//             count: '300',
//             image: 'pokepocket/card-flairs/item-trade-token.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '0',
//               },
//             ],
//             from_date: 1734415200,
//           },
//         ],
//         routeName: 'A',
//       },
//       {
//         flairs: [
//           {
//             name: 'Tiny Twinkles Flair: Yellow (Battle)',
//             slug: 'battle-effect-tiny-twinkles-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-tiny-twinkles-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Star Outlines Flair: Purple (Battle)',
//             slug: 'battle-effect-star-outlines-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-star-outlines-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '2,700',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Mini Triangles Flair: Purple (Battle)',
//             slug: 'battle-effect-mini-triangles-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-mini-triangles-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '5,400',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Big Rings Flair: Purple (Battle)',
//             slug: 'battle-effect-big-rings-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-big-rings-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '8,100',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Special shop ticket',
//             slug: 'item-special-shop-ticket',
//             type: 'Item',
//             count: '5',
//             image: 'pokepocket/card-flairs/item-special-shop-ticket.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Trade Token',
//             slug: 'item-trade-token',
//             type: 'Item',
//             count: '300',
//             image: 'pokepocket/card-flairs/item-trade-token.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '0',
//               },
//             ],
//             from_date: 1734415200,
//           },
//         ],
//         routeName: 'B',
//       },
//       {
//         flairs: [
//           {
//             name: 'Tiny Twinkles Flair: Yellow (Battle)',
//             slug: 'battle-effect-tiny-twinkles-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-tiny-twinkles-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Mini Triangles Flair: Purple (Battle)',
//             slug: 'battle-effect-mini-triangles-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-mini-triangles-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '2,700',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Big Rings Flair: Purple (Battle)',
//             slug: 'battle-effect-big-rings-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-big-rings-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '5,400',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Star Outlines Flair: Purple (Battle)',
//             slug: 'battle-effect-star-outlines-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-star-outlines-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '8,100',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Special shop ticket',
//             slug: 'item-special-shop-ticket',
//             type: 'Item',
//             count: '5',
//             image: 'pokepocket/card-flairs/item-special-shop-ticket.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Trade Token',
//             slug: 'item-trade-token',
//             type: 'Item',
//             count: '300',
//             image: 'pokepocket/card-flairs/item-trade-token.webp',
//             demands: [
//               {
//                 name: 'Mismagius ex',
//                 slug: 'mismagius-ex',
//                 image: 'pokepocket/card-flair-demands/mismagius-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '0',
//               },
//             ],
//             from_date: 1734415200,
//           },
//         ],
//         routeName: 'C',
//       },
//     ],
//     price: '0',
//     price_date: '0',
//     foilPrice: '0',
//     deltaPrice: '0',
//     deltaFoilPrice: '0',
//     delta7dPrice: '0',
//     delta7dPriceFoil: '0',
//   },
//   {
//     id: 'A2-185',
//     setId: 'A2',
//     number: '185',
//     name: 'Gallade ex',
//     set_code: 'A2',
//     set_name: 'Space-Time Smackdown',
//     rarity: 'Super Rare',
//     color: 'Fighting',
//     type: 'Pokemon',
//     slug: 'a2-185-gallade-ex',
//     has_image: '1',
//     has_art: '0',
//     dex: 'A2_1',
//     hp: '170',
//     stage: 'Stage 2',
//     prew_stage_name: 'Kirlia',
//     attack: [
//       {
//         info: '{FF} Energized Blade 70+',
//         effect:
//           "This attack does 20 more damage for each Energy attached to your opponent's Active Pokémon.",
//       },
//     ],
//     ability: [],
//     text: null,
//     weakness: 'Psychic',
//     retreat: '1',
//     rule: 'When your Pokémon \u003Cstrong\u003Eex\u003C/strong\u003E is \u003Cstrong\u003EKnocked Out\u003C/strong\u003E, your opponent gets \u003Cstrong\u003E2\u003C/strong\u003E points.',
//     illustrator: 'PLANETA CG Works',
//     props: [
//       {
//         name: 'Pokémon ID',
//         value: 'ERUREIDO_EX',
//       },
//       {
//         name: 'Card Number',
//         value: 'A2-185',
//       },
//       {
//         name: 'Dupe Reward',
//         value: '870',
//       },
//       {
//         name: 'Pack Point',
//         value: '1,250',
//       },
//     ],
//     flairs: [
//       {
//         flairs: [
//           {
//             name: 'Tiny Twinkles Flair: Yellow (Battle)',
//             slug: 'battle-effect-tiny-twinkles-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-tiny-twinkles-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Small Stars Flair: Yellow (Battle)',
//             slug: 'battle-effect-small-stars-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-small-stars-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '2,700',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Sword Flash Flair: Orange (Battle)',
//             slug: 'battle-effect-sword-flash-flair-orange-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-sword-flash-flair-orange-battle.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '5,400',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Bursts Flair: Orange (Battle)',
//             slug: 'battle-effect-bursts-flair-orange-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-bursts-flair-orange-battle.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '8,100',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Special shop ticket',
//             slug: 'item-special-shop-ticket',
//             type: 'Item',
//             count: '5',
//             image: 'pokepocket/card-flairs/item-special-shop-ticket.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Trade Token',
//             slug: 'item-trade-token',
//             type: 'Item',
//             count: '300',
//             image: 'pokepocket/card-flairs/item-trade-token.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '0',
//               },
//             ],
//             from_date: 1734415200,
//           },
//         ],
//         routeName: 'A',
//       },
//       {
//         flairs: [
//           {
//             name: 'Tiny Twinkles Flair: Yellow (Battle)',
//             slug: 'battle-effect-tiny-twinkles-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-tiny-twinkles-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Sword Flash Flair: Orange (Battle)',
//             slug: 'battle-effect-sword-flash-flair-orange-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-sword-flash-flair-orange-battle.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '2,700',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Bursts Flair: Orange (Battle)',
//             slug: 'battle-effect-bursts-flair-orange-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-bursts-flair-orange-battle.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '5,400',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Small Stars Flair: Yellow (Battle)',
//             slug: 'battle-effect-small-stars-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-small-stars-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '8,100',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Special shop ticket',
//             slug: 'item-special-shop-ticket',
//             type: 'Item',
//             count: '5',
//             image: 'pokepocket/card-flairs/item-special-shop-ticket.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Trade Token',
//             slug: 'item-trade-token',
//             type: 'Item',
//             count: '300',
//             image: 'pokepocket/card-flairs/item-trade-token.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '0',
//               },
//             ],
//             from_date: 1734415200,
//           },
//         ],
//         routeName: 'B',
//       },
//       {
//         flairs: [
//           {
//             name: 'Tiny Twinkles Flair: Yellow (Battle)',
//             slug: 'battle-effect-tiny-twinkles-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-tiny-twinkles-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Bursts Flair: Orange (Battle)',
//             slug: 'battle-effect-bursts-flair-orange-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-bursts-flair-orange-battle.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '2,700',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Small Stars Flair: Yellow (Battle)',
//             slug: 'battle-effect-small-stars-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-small-stars-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '5,400',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Sword Flash Flair: Orange (Battle)',
//             slug: 'battle-effect-sword-flash-flair-orange-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-sword-flash-flair-orange-battle.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '8,100',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Special shop ticket',
//             slug: 'item-special-shop-ticket',
//             type: 'Item',
//             count: '5',
//             image: 'pokepocket/card-flairs/item-special-shop-ticket.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Trade Token',
//             slug: 'item-trade-token',
//             type: 'Item',
//             count: '300',
//             image: 'pokepocket/card-flairs/item-trade-token.webp',
//             demands: [
//               {
//                 name: 'Gallade ex',
//                 slug: 'gallade-ex',
//                 image: 'pokepocket/card-flair-demands/gallade-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '0',
//               },
//             ],
//             from_date: 1734415200,
//           },
//         ],
//         routeName: 'C',
//       },
//     ],
//     price: '0',
//     price_date: '0',
//     foilPrice: '0',
//     deltaPrice: '0',
//     deltaFoilPrice: '0',
//     delta7dPrice: '0',
//     delta7dPriceFoil: '0',
//   },
//   {
//     id: 'A2-186',
//     setId: 'A2',
//     number: '186',
//     name: 'Weavile ex',
//     set_code: 'A2',
//     set_name: 'Space-Time Smackdown',
//     rarity: 'Super Rare',
//     color: 'Darkness',
//     type: 'Pokemon',
//     slug: 'a2-186-weavile-ex',
//     has_image: '1',
//     has_art: '0',
//     dex: 'A2_2',
//     hp: '140',
//     stage: 'Stage 1',
//     prew_stage_name: 'Sneasel',
//     attack: [
//       {
//         info: '{D} Scratching Nails 30+',
//         effect:
//           "If your opponent's Active Pokémon has damage on it, this attack does 40 more damage.",
//       },
//     ],
//     ability: [],
//     text: null,
//     weakness: 'Grass',
//     retreat: '1',
//     rule: 'When your Pokémon \u003Cstrong\u003Eex\u003C/strong\u003E is \u003Cstrong\u003EKnocked Out\u003C/strong\u003E, your opponent gets \u003Cstrong\u003E2\u003C/strong\u003E points.',
//     illustrator: 'PLANETA CG Works',
//     props: [
//       {
//         name: 'Pokémon ID',
//         value: 'MANYULA_EX',
//       },
//       {
//         name: 'Card Number',
//         value: 'A2-186',
//       },
//       {
//         name: 'Dupe Reward',
//         value: '870',
//       },
//       {
//         name: 'Pack Point',
//         value: '1,250',
//       },
//     ],
//     flairs: [
//       {
//         flairs: [
//           {
//             name: 'Tiny Twinkles Flair: Yellow (Battle)',
//             slug: 'battle-effect-tiny-twinkles-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-tiny-twinkles-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Circles Flair: Purple (Battle)',
//             slug: 'battle-effect-circles-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-circles-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '2,700',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Big Rings Flair: Purple (Battle)',
//             slug: 'battle-effect-big-rings-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-big-rings-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '5,400',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Sword Flash Flair: Purple (Battle)',
//             slug: 'battle-effect-sword-flash-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-sword-flash-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '8,100',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Special shop ticket',
//             slug: 'item-special-shop-ticket',
//             type: 'Item',
//             count: '5',
//             image: 'pokepocket/card-flairs/item-special-shop-ticket.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Trade Token',
//             slug: 'item-trade-token',
//             type: 'Item',
//             count: '300',
//             image: 'pokepocket/card-flairs/item-trade-token.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '0',
//               },
//             ],
//             from_date: 1734415200,
//           },
//         ],
//         routeName: 'A',
//       },
//       {
//         flairs: [
//           {
//             name: 'Tiny Twinkles Flair: Yellow (Battle)',
//             slug: 'battle-effect-tiny-twinkles-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-tiny-twinkles-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Big Rings Flair: Purple (Battle)',
//             slug: 'battle-effect-big-rings-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-big-rings-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '2,700',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Sword Flash Flair: Purple (Battle)',
//             slug: 'battle-effect-sword-flash-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-sword-flash-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '5,400',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Circles Flair: Purple (Battle)',
//             slug: 'battle-effect-circles-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-circles-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '8,100',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Special shop ticket',
//             slug: 'item-special-shop-ticket',
//             type: 'Item',
//             count: '5',
//             image: 'pokepocket/card-flairs/item-special-shop-ticket.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Trade Token',
//             slug: 'item-trade-token',
//             type: 'Item',
//             count: '300',
//             image: 'pokepocket/card-flairs/item-trade-token.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '0',
//               },
//             ],
//             from_date: 1734415200,
//           },
//         ],
//         routeName: 'B',
//       },
//       {
//         flairs: [
//           {
//             name: 'Tiny Twinkles Flair: Yellow (Battle)',
//             slug: 'battle-effect-tiny-twinkles-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-tiny-twinkles-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Sword Flash Flair: Purple (Battle)',
//             slug: 'battle-effect-sword-flash-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-sword-flash-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '2,700',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Circles Flair: Purple (Battle)',
//             slug: 'battle-effect-circles-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-circles-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '5,400',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Big Rings Flair: Purple (Battle)',
//             slug: 'battle-effect-big-rings-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-big-rings-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '8,100',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Special shop ticket',
//             slug: 'item-special-shop-ticket',
//             type: 'Item',
//             count: '5',
//             image: 'pokepocket/card-flairs/item-special-shop-ticket.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Trade Token',
//             slug: 'item-trade-token',
//             type: 'Item',
//             count: '300',
//             image: 'pokepocket/card-flairs/item-trade-token.webp',
//             demands: [
//               {
//                 name: 'Weavile ex',
//                 slug: 'weavile-ex',
//                 image: 'pokepocket/card-flair-demands/weavile-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '0',
//               },
//             ],
//             from_date: 1734415200,
//           },
//         ],
//         routeName: 'C',
//       },
//     ],
//     price: '0',
//     price_date: '0',
//     foilPrice: '0',
//     deltaPrice: '0',
//     deltaFoilPrice: '0',
//     delta7dPrice: '0',
//     delta7dPriceFoil: '0',
//   },
//   {
//     id: 'A2-187',
//     setId: 'A2',
//     number: '187',
//     name: 'Darkrai ex',
//     set_code: 'A2',
//     set_name: 'Space-Time Smackdown',
//     rarity: 'Super Rare',
//     color: 'Darkness',
//     type: 'Pokemon',
//     slug: 'a2-187-darkrai-ex',
//     has_image: '1',
//     has_art: '0',
//     dex: 'A2_1',
//     hp: '140',
//     stage: 'Basic',
//     prew_stage_name: null,
//     attack: [
//       {
//         info: '{DDC} Dark Prism 80',
//         effect: '',
//       },
//     ],
//     ability: [
//       {
//         info: 'Nightmare Aura',
//         effect:
//           'Whenever you attach a \u003Cspan class="energy-text energy-text--type-darkness"\u003E\u003C/span\u003E Energy from your Energy Zone to this Pokémon, do 20 damage to your opponent’s Active Pokémon.',
//       },
//     ],
//     text: null,
//     weakness: 'Grass',
//     retreat: '2',
//     rule: 'When your Pokémon \u003Cstrong\u003Eex\u003C/strong\u003E is \u003Cstrong\u003EKnocked Out\u003C/strong\u003E, your opponent gets \u003Cstrong\u003E2\u003C/strong\u003E points.',
//     illustrator: 'PLANETA Yamashita',
//     props: [
//       {
//         name: 'Pokémon ID',
//         value: 'DARKRAI_EX',
//       },
//       {
//         name: 'Card Number',
//         value: 'A2-187',
//       },
//       {
//         name: 'Dupe Reward',
//         value: '870',
//       },
//       {
//         name: 'Pack Point',
//         value: '1,250',
//       },
//     ],
//     flairs: [
//       {
//         flairs: [
//           {
//             name: 'Tiny Twinkles Flair: Yellow (Battle)',
//             slug: 'battle-effect-tiny-twinkles-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-tiny-twinkles-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Big Rings Flair: Blue (Battle)',
//             slug: 'battle-effect-big-rings-flair-blue-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-big-rings-flair-blue-battle.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '2,700',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Bursts Flair: Purple (Battle)',
//             slug: 'battle-effect-bursts-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-bursts-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '5,400',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Mini Triangles Flair: Purple (Battle)',
//             slug: 'battle-effect-mini-triangles-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-mini-triangles-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '8,100',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Special shop ticket',
//             slug: 'item-special-shop-ticket',
//             type: 'Item',
//             count: '5',
//             image: 'pokepocket/card-flairs/item-special-shop-ticket.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Trade Token',
//             slug: 'item-trade-token',
//             type: 'Item',
//             count: '300',
//             image: 'pokepocket/card-flairs/item-trade-token.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '0',
//               },
//             ],
//             from_date: 1734415200,
//           },
//         ],
//         routeName: 'A',
//       },
//       {
//         flairs: [
//           {
//             name: 'Tiny Twinkles Flair: Yellow (Battle)',
//             slug: 'battle-effect-tiny-twinkles-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-tiny-twinkles-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Bursts Flair: Purple (Battle)',
//             slug: 'battle-effect-bursts-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-bursts-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '2,700',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Mini Triangles Flair: Purple (Battle)',
//             slug: 'battle-effect-mini-triangles-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-mini-triangles-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '5,400',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Big Rings Flair: Blue (Battle)',
//             slug: 'battle-effect-big-rings-flair-blue-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-big-rings-flair-blue-battle.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '8,100',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Special shop ticket',
//             slug: 'item-special-shop-ticket',
//             type: 'Item',
//             count: '5',
//             image: 'pokepocket/card-flairs/item-special-shop-ticket.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Trade Token',
//             slug: 'item-trade-token',
//             type: 'Item',
//             count: '300',
//             image: 'pokepocket/card-flairs/item-trade-token.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '0',
//               },
//             ],
//             from_date: 1734415200,
//           },
//         ],
//         routeName: 'B',
//       },
//       {
//         flairs: [
//           {
//             name: 'Tiny Twinkles Flair: Yellow (Battle)',
//             slug: 'battle-effect-tiny-twinkles-flair-yellow-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-tiny-twinkles-flair-yellow-battle.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Mini Triangles Flair: Purple (Battle)',
//             slug: 'battle-effect-mini-triangles-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-mini-triangles-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '2,700',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Big Rings Flair: Blue (Battle)',
//             slug: 'battle-effect-big-rings-flair-blue-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-big-rings-flair-blue-battle.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '5,400',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Bursts Flair: Purple (Battle)',
//             slug: 'battle-effect-bursts-flair-purple-battle',
//             type: 'Battle Effect',
//             count: '1',
//             image:
//               'pokepocket/card-flairs/battle-effect-bursts-flair-purple-battle.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '8,100',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Special shop ticket',
//             slug: 'item-special-shop-ticket',
//             type: 'Item',
//             count: '5',
//             image: 'pokepocket/card-flairs/item-special-shop-ticket.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '1,800',
//               },
//             ],
//             from_date: 1738216800,
//           },
//           {
//             name: 'Trade Token',
//             slug: 'item-trade-token',
//             type: 'Item',
//             count: '300',
//             image: 'pokepocket/card-flairs/item-trade-token.webp',
//             demands: [
//               {
//                 name: 'Darkrai ex',
//                 slug: 'darkrai-ex',
//                 image: 'pokepocket/card-flair-demands/darkrai-ex.webp',
//                 amount: '1',
//               },
//               {
//                 name: 'Shinedust',
//                 slug: 'shinedust',
//                 image: 'pokepocket/card-flair-demands/shinedust.webp',
//                 amount: '0',
//               },
//             ],
//             from_date: 1734415200,
//           },
//         ],
//         routeName: 'C',
//       },
//     ],
//     price: '0',
//     price_date: '0',
//     foilPrice: '0',
//     deltaPrice: '0',
//     deltaFoilPrice: '0',
//     delta7dPrice: '0',
//     delta7dPriceFoil: '0',
//   },
// ]

type Props = {
  numCards: number
}

const CardsArc = ({ numCards }: Props) => {
  const a = 0.003
  const parabola = (x: number) => a * x * x
  const slope = (x: number) => 2 * a * x
  const slopeToAngle = (m: number) => (Math.atan(m) * 180) / Math.PI

  return (
    <div className="relative h-full w-full">
      {[...Array(numCards)].map((_, i) => {
        const spacing = 100 / numCards
        const half = (numCards - 1) / 2
        const x = (i - half) * spacing
        const y = parabola(x) // Negative for upward screen direction
        const angle = slopeToAngle(slope(x))

        return (
          <div
            key={i}
            className="absolute bottom-0 left-1/2 "
            style={{
              transformOrigin: 'center',
              transform: `translateX(-50%) translateX(${x}vw) translateY(${y}vw) rotate(${angle}deg) `,
              zIndex: 20 + i,
              width: `${spacing * 1.3}vw`,
            }}
          >
            <img
              src="cardback.png" // Replace with your actual card image
              alt="cardback"
              className="transition-transform duration-50 hover:scale-110"
            />
          </div>
        )
      })}
    </div>
  )
}

export default CardsArc

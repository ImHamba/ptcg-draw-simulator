type Props = {
  className: string
  color?: string
}

const PokeBallSvg = ({ className, color = 'black' }: Props) => {
  return (
    <svg className={className} viewBox="0 0 100 100">
      <mask id="band-mask" maskUnits="userSpaceOnUse">
        <rect width="120" height="100" fill="white" />
        <rect y="45%" width="100" height="10" fill="black" />
      </mask>

      <g mask="url(#band-mask)">
        <path
          d="M16 50 A34 34 0 0 1 84 50 A34 34 0 0 1 16 50"
          style={{ fill: 'none', stroke: color, strokeWidth: 32 }}
        />
      </g>
    </svg>
  )
}

export default PokeBallSvg

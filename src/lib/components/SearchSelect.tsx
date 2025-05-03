import Choices, { type EventChoice } from 'choices.js'
import 'choices.js/public/assets/styles/choices.min.css'
import { useEffect, useRef } from 'react'

type SelectOption = { value: string; label: string }

type Props = {
  options: SelectOption[]
  className: string
  onSelect: (value: string) => void
}

const SearchSelect = ({ options, className, onSelect }: Props) => {
  const selectRef = useRef(null)
  const choicesInstance = useRef<Choices>(null)

  useEffect(() => {
    if (selectRef.current) {
      choicesInstance.current = new Choices(selectRef.current, {
        searchEnabled: true,
        shouldSort: false,
        removeItemButton: true,
        searchPlaceholderValue: 'Search for a card...',
        placeholderValue: 'Search for a card...',

        // @ts-ignore
        classNames: {
          containerOuter: ['choices', ...className.split(' ')],
        },
      })

      choicesInstance.current?.removeActiveItems()
    }

    // Cleanup
    return () => {
      if (choicesInstance.current) {
        choicesInstance.current.destroy()
      }
    }
  }, [options])

  const handleOnSelect = () => {
    onSelect((choicesInstance.current?.getValue() as EventChoice).value)

    choicesInstance.current?.removeActiveItems()
  }

  return (
    <select ref={selectRef} className={className} onChange={handleOnSelect}>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default SearchSelect

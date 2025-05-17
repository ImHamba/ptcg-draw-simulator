import type { EventChoice } from 'choices.js'
import Choices from 'choices.js'
import 'choices.js/public/assets/styles/choices.min.css'
import { useEffect, useMemo, useRef } from 'react'

type SelectOption = { value: string; label: string }

type Props = {
  options: SelectOption[]
  className: string
  onSelect: (value: string) => void
  disabled?: boolean
}

const SearchSelect = ({
  options,
  className,
  onSelect,
  disabled = false,
}: Props) => {
  const selectRef = useRef<HTMLSelectElement>(null)
  const choicesInstance = useRef<Choices>(null)

  useEffect(() => {
    if (selectRef.current) {
      choicesInstance.current = new Choices(selectRef.current, {
        searchEnabled: true,
        shouldSort: false,
        removeItemButton: true,
        searchPlaceholderValue: 'Search for a card...',
        placeholderValue: 'Search for a card...',
        itemSelectText: undefined,
      })

      choicesInstance.current.removeActiveItems()
    }

    // Cleanup
    return () => {
      if (choicesInstance.current) {
        choicesInstance.current.destroy()
      }
    }
  }, [className, options])

  const handleOnSelect = () => {
    onSelect((choicesInstance.current?.getValue() as EventChoice).value)

    choicesInstance.current?.removeActiveItems()
  }

  const optionsElements = useMemo(() => {
    return options.map((option) => (
      <option value={option.value} key={option.value}>
        {option.label}
      </option>
    ))
  }, [options])

  return (
    <div className={className}>
      <select
        disabled={disabled}
        ref={selectRef}
        className={className}
        onChange={handleOnSelect}
      >
        {optionsElements}
      </select>
    </div>
  )
}

export default SearchSelect

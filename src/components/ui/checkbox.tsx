'use client'
import { Check } from 'lucide-react'
import { useState } from 'react'

interface CheckboxProps {
  selected?: boolean
}

export function Checkbox({ selected }: CheckboxProps) {
  const [isSelected, setIsSelected] = useState(false)

  if (selected) {
    setIsSelected(true)
  }

  function handleClick() {
    setIsSelected(!isSelected)
  }

  return (
    <div
      className="flex h-5 w-5 items-center justify-center rounded border-2 border-zinc-300"
      onClick={handleClick}
    >
      {isSelected && (
        <div className="rounded bg-violet-400">
          <Check className="text-violet-600" />
        </div>
      )}
    </div>
  )
}

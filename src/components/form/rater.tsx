'use client'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { useController, useFormContext } from 'react-hook-form'

interface RaterProps {
  name: string
  withRatingLabel?: boolean
}

function getRating(rating: number) {
  switch (rating) {
    case 1:
      return 'Péssimo'
    case 2:
      return 'Ruim'
    case 3:
      return 'Bom'
    case 4:
      return 'Ótimo'
    case 5:
      return 'Excelente'
    default:
      return 'Nao definido'
  }
}

export function Rater({ name, withRatingLabel = false }: RaterProps) {
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
  })

  return (
    <div>
      <Rating
        style={{ maxWidth: 180 }}
        value={field.value}
        onChange={field.onChange}
      />

      {withRatingLabel && <p>{getRating(field.value)}</p>}
    </div>
  )
}

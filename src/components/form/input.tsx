import { ComponentProps } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { Input as InputUI } from '../ui/input'

interface InputProps extends ComponentProps<typeof InputUI> {
  name: string
}

export function Input({ name, ...props }: InputProps) {
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
  })

  return (
    <InputUI
      {...props}
      value={field.value}
      onChange={(e) => field.onChange(e.target.value)}
    />
  )
}

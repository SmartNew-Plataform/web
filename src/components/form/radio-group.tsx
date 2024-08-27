import { ComponentProps } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { RadioGroup as RadioGroupLib } from '../ui/radio-group'

interface RadioGroupProps extends ComponentProps<typeof RadioGroupLib> {
  name: string
}

export function RadioGroup({ name, ...props }: RadioGroupProps) {
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
  })

  return (
    <RadioGroupLib
      value={field.value}
      onValueChange={field.onChange}
      {...props}
    />
  )
}

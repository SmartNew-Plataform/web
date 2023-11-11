import { Checkbox as CheckboxUI } from '@/components/ui/checkbox'
import { ComponentProps } from 'react'
import { useController, useFormContext } from 'react-hook-form'

type CheckboxProps = ComponentProps<typeof CheckboxUI> & {
  name: string
}

export function Checkbox({ name, ...props }: CheckboxProps) {
  const { control } = useFormContext()
  const { field } = useController({
    control,
    name,
  })
  return (
    <CheckboxUI
      {...props}
      checked={field.value}
      onCheckedChange={field.onChange}
    />
  )
}

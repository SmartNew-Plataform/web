import { ComponentProps } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { Textarea as TextareaUI } from '../ui/textarea'

interface TextareProps extends ComponentProps<typeof TextareaUI> {
  name: string
}

export function Textarea({ name, ...props }: TextareProps) {
  const { control } = useFormContext()
  const { field } = useController({
    control,
    name,
  })
  return (
    <TextareaUI
      {...props}
      value={field.value}
      onChange={(e) => field.onChange(e.target.value)}
      name={name}
    />
  )
}

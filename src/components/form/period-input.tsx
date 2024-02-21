import { Controller, useFormContext } from 'react-hook-form'
import { Form } from '.'

interface PeriodInputProps {
  name: string
}

export function PeriodInput({ name }: PeriodInputProps) {
  const { control } = useFormContext()

  return (
    <div className="flex w-full items-center gap-2">
      <Controller
        name={`${name}.from`}
        control={control}
        render={({ field }) => <Form.Input type="date" {...field} />}
      />
      a
      <Controller
        name={`${name}.to`}
        control={control}
        render={({ field }) => <Form.Input type="date" {...field} />}
      />
    </div>
  )
}

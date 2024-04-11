import { ComponentProps } from 'react'
import { useFormContext } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

interface ErrorMessageProps extends ComponentProps<'span'> {
  field: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function get(obj: Record<any, any>, path: string) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj,
      )

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)

  return result
}

export function ErrorMessage({
  field,
  className,
  ...props
}: ErrorMessageProps) {
  const {
    formState: { errors },
  } = useFormContext()

  const fieldError = get(errors, field)

  if (!fieldError) {
    return null
  }

  return (
    <span
      {...props}
      className={twMerge('mt-1 text-xs text-red-500', className)}
    >
      {fieldError.message?.toString()}
    </span>
  )
}

import { ComponentProps, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface FieldProps extends ComponentProps<'div'> {
  children: ReactNode
}

export function Field({ children, className, ...props }: FieldProps) {
  return (
    <div {...props} className={twMerge('flex flex-col gap-3', className)}>
      {children}
    </div>
  )
}

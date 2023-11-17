import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type PageWrapperProps = ComponentProps<'div'>

export function PageWrapper({
  children,
  className,
  ...props
}: PageWrapperProps) {
  return (
    <div
      className={twMerge(
        'flex h-full w-full flex-col gap-4 p-4 pt-0',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

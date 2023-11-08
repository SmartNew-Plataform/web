import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { Card } from './ui/card'

type PageHeaderProps = ComponentProps<typeof Card>

export function PageHeader({ children, className, ...props }: PageHeaderProps) {
  return (
    <Card
      className={twMerge(
        'flex w-full items-center justify-between gap-4 rounded-md p-4',
        className,
      )}
      {...props}
    >
      {children}
    </Card>
  )
}

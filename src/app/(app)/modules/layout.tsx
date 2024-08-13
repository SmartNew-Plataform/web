import { ComponentProps } from 'react'

export default function LayoutModules({ ...props }: ComponentProps<'div'>) {
  return <div {...props} />
}

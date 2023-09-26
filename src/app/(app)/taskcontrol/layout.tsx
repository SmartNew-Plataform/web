import { ReactNode } from 'react'
import { HeaderTaskControl } from './header-taskcontrol'

interface TaskControlLayoutProps {
  children: ReactNode
}

export default function TaskControlLayout({
  children,
}: TaskControlLayoutProps) {
  return (
    <>
      <HeaderTaskControl />
      {children}
    </>
  )
}

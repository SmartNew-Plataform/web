import { ReactNode } from 'react'
import { HeaderTaskControl } from './header-taskcontrol'

interface TaskControlLayoutProps {
  children: ReactNode
}

export default function TaskControlLayout({
  children,
}: TaskControlLayoutProps) {
  return (
    <div className="flex h-screen flex-col pb-4">
      <HeaderTaskControl />
      {children}
    </div>
  )
}

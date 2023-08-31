import { ReactNode } from 'react'

interface FieldProps {
  children: ReactNode
}

export function Field({ children }: FieldProps) {
  return <div className="flex flex-col gap-3">{children}</div>
}

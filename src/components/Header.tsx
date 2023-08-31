'use client'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/store/user-store'
import { HTMLAttributes, ReactNode } from 'react'

interface HeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode
}

export function Header({ children, ...props }: HeaderProps) {
  const { user } = useUserStore()
  return (
    <header
      {...props}
      className={cn(
        'flex h-20 items-center justify-between bg-white px-6 shadow-lg shadow-zinc-300/40 ',
        props.className,
      )}
    >
      {children || <span />}

      <div className="flex items-center gap-2 rounded p-2 transition hover:bg-zinc-100">
        <span className="text-xs text-zinc-600">{user?.login}</span>

        <div className="flex h-[35px] w-[35px] items-center justify-center rounded bg-violet-200 text-violet-600">
          <span className="uppercase">{user?.login.split('')[0]}</span>
        </div>
      </div>
    </header>
  )
}

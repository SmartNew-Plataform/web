import { ReactNode } from 'react'

interface HeaderProps {
  children?: ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between bg-white px-6 shadow-lg shadow-zinc-300/40 ">
      {children || <span />}

      <div className="flex items-center gap-2 rounded p-2 transition hover:bg-zinc-100">
        <span className="text-xs text-zinc-600">Usuario Teste</span>

        <div className="flex h-[35px] w-[35px] items-center justify-center rounded bg-violet-200 text-violet-600">
          <span className="">U</span>
        </div>
      </div>
    </header>
  )
}

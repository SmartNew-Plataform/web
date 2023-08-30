import Image from 'next/image'
import { Modules } from './Modules'

export default function LayoutApp({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen">
      <menu className="sticky top-0 flex flex-col items-center gap-6 bg-violet-500 px-5 py-6">
        <Image
          src={'/smart-logo-icon.png'}
          alt={'SmartNew Logo'}
          width={30}
          height={30}
        />
        <Modules />
      </menu>

      <div className="h-full w-full overflow-auto bg-zinc-200">{children}</div>
    </div>
  )
}

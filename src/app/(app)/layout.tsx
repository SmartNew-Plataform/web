import { Modules } from '@/components/modules'
import Image from 'next/image'

export default function LayoutApp({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen">
      <menu className="sticky top-0 z-30 flex flex-col items-center gap-6 bg-violet-500 py-6">
        <Image
          src={'/smart-logo-icon.png'}
          alt={'SmartNew Logo'}
          width={30}
          height={30}
        />
        <Modules />
      </menu>

      <div className="z-20 h-full w-full overflow-auto bg-zinc-50">
        {children}
      </div>
    </div>
  )
}

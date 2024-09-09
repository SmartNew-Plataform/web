'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'

export function Header({ children }: { children: ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  function handleChangeTab(tab: string) {
    router.push(`${tab}?token=${searchParams.get('token')}`)
  }

  const pathnameList = pathname.split('/')
  const tabValue = pathnameList[pathnameList.length - 1]

  return (
    <Tabs
      defaultValue="details"
      value={tabValue}
      className="flex h-full w-full flex-col items-start gap-4"
      onValueChange={handleChangeTab}
    >
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            router.push(
              `/manutencao/order-service?token=${searchParams.get('token')}&h=hidden`,
            )
          }
        >
          <ChevronLeft size={16} />
        </Button>
        <TabsList>
          <TabsTrigger value="details">Detalhes O.S.</TabsTrigger>
          <TabsTrigger value="technical-details" disabled>
            Parecer Técnico 
          </TabsTrigger>
          <TabsTrigger value="checklist" disabled>
            Checklist
          </TabsTrigger>
          <TabsTrigger value="timekeeping">Apontamento de horas</TabsTrigger>
          <TabsTrigger value="stop-recording">Registro de paradas</TabsTrigger>
          <TabsTrigger value="material">Materiais</TabsTrigger>
          <TabsTrigger value="diverse">Diversos</TabsTrigger>
          <TabsTrigger value="failure-analysis">Análise de falhas</TabsTrigger>
          <TabsTrigger value="attach">Anexos</TabsTrigger>
        </TabsList>
      </div>

      <main className="flex h-full w-full flex-col gap-4 overflow-auto">
        {children}
      </main>
    </Tabs>
  )
}

'use client'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { useServiceOrder } from '@/store/maintenance/service-order'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { ServiceOrderForm } from './service-order-form'

export function Header() {
  const { fetchSelects } = useServiceOrder()

  useQuery({
    queryKey: ['maintenance-service-order-selects'],
    queryFn: fetchSelects,
  })

  return (
    <>
      <PageHeader>
        <h1 className="text-xl font-semibold text-slate-600">
          Ordem de Serviço
        </h1>

        <div className="flex gap-4">
          <ServiceOrderForm data={[]}>
            <Button>
              <Plus size={16} />
              Criar
            </Button>
          </ServiceOrderForm>
        </div>
      </PageHeader>
    </>
  )
}

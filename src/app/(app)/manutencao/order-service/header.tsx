'use client'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useServiceOrder } from '@/store/maintenance/service-order'
import { useQuery } from '@tanstack/react-query'
import { Columns3, Plus, Sheet } from 'lucide-react'
import { ServiceOrderForm } from './service-order-form'
import { StatusFilter } from './status-filter'

export function Header() {
  const {
    fetchSelects,
    statusFilterValue,
    setStatusFilterValue,
    statusFilterData,
    setViewMode,
    viewMode,
  } = useServiceOrder()

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

        <StatusFilter
          value={statusFilterValue}
          onChange={setStatusFilterValue}
          data={statusFilterData || []}
        />

        <div className="flex gap-4">
          <Tabs
            onValueChange={(value) => setViewMode(value as 'kanban' | 'grid')}
            value={viewMode}
          >
            <TabsList>
              <TabsTrigger value="kanban">
                <Columns3 size={14} />
              </TabsTrigger>
              <TabsTrigger value="grid">
                <Sheet size={14} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
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

'use client'
import { SelectData } from '@/@types/select-data'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useServiceOrder } from '@/store/maintenance/service-order'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { ServiceOrderForm } from './service-order-form'

export function Header() {
  const { setSelects } = useServiceOrder()

  async function fetchSelects() {
    const [
      branch,
      allEquipment,
      allTypeMaintenance,
      allMaintenanceSector,
      allStatus,
      allListRequester,
    ] = await Promise.all([
      await api.get('system/list-branch').then((res) => res.data.data),
      await api.get('system/equipment').then((res) => res.data.data),
      await api
        .get('/system/choices/type-maintenance')
        .then((res) => res.data.data),
      await api
        .get('/system/choices/sector-executing')
        .then((res) => res.data.data),
      await api
        .get('/maintenance/service-order/status')
        .then((res) => res.data.data),
      await api.get('/system/choices/requester').then((res) => res.data.data),
    ])
    // console.log('branch => ', branch)

    const result = {
      branch: branch.map(
        ({ value, label }: { value: string; label: string }) => {
          return {
            value,
            label,
          }
        },
      ),
      equipment: allEquipment.map(
        (value: {
          id: number
          equipmentCode: string
          description: string
          branch: SelectData
        }) => {
          return {
            value: value.id.toString(),
            label: `${value.equipmentCode} - ${value.description}`,
            branch: value.branch,
          }
        },
      ),
      typeMaintenance: allTypeMaintenance,
      maintenanceSector: allMaintenanceSector,

      status: allStatus.map((item: { status: string; id: number }) => ({
        label: item.status,
        value: String(item.id),
      })),
      requester: allListRequester,
    }

    setSelects(result)

    return result
  }

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
          <SearchInput />

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

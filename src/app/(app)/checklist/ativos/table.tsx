'use client'
import { Active } from '@/@types/active'
import { DataTable } from '@/components/data-table'
import { api } from '@/lib/api'
import { useActives } from '@/store/smartlist/actives'
import { useQuery } from '@tanstack/react-query'
import { columns } from './columns'

export function Table() {
  const { setSelects } = useActives()

  async function fetchActives() {
    const response = await api
      .get<{ data: Active[] }>('system/equipment')
      .then((res) => res.data)

    return response.data
  }

  async function fetchSelects() {
    const [
      client,
      equipmentDad,
      costCenter,
      family,
      equipmentStatus,
      consumptionType,
      unityMeter,
      fleet,
      componentStatus,
    ] = await Promise.all([
      await api.get('system/list-branch').then((res) => res.data.data),
      await api
        .get<{ data: Active[] }>('system/equipment')
        .then((res) => res.data.data),
      await api.get('system/list-cost-center').then((res) => res.data.data),
      await api.get('smart-list/family').then((res) => res.data),
      await api
        .get('system/equipment/list-status-equipment')
        .then((res) => res.data.data),
      await api
        .get('system/equipment/list-consumption-type')
        .then((res) => res.data.data),
      await api.get('system/equipment/list-unity').then((res) => res.data.data),
      await api.get('system/equipment/list-fleet').then((res) => res.data.data),
      await api
        .get('system/equipment/list-component-status')
        .then((res) => res.data.data),
    ])

    setSelects({
      equipmentDad: equipmentDad.map(({ id, description }) => ({
        label: description,
        value: id.toString(),
      })),
      client,
      costCenter,
      family: family.map(({ id, family }: { id: number; family: string }) => ({
        label: family,
        value: id.toString(),
      })),
      equipmentStatus,
      consumptionType,
      unityMeter,
      fleet,
      componentStatus,
    })
  }

  const { data } = useQuery({
    queryKey: ['checklist-list-actives'],
    queryFn: fetchActives,
  })

  useQuery({
    queryKey: ['checklist-actives-selects'],
    queryFn: fetchSelects,
  })

  console.log(data)

  return <DataTable columns={columns} data={data || []} />
}

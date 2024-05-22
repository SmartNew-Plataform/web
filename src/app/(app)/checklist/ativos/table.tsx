'use client'
import { Active } from '@/@types/active'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useActives } from '@/store/smartlist/actives'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { ActiveForm, ActiveFormData } from './active-form'

export function Table() {
  const { setSelects } = useActives()
  const [currentActive, setCurrentActive] = useState<Active | undefined>()

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

  async function handleEditActive(data: ActiveFormData) {
    console.log(data)
  }

  async function fetchActive(id: number) {
    const response = await api
      .get(`system/equipment/${id}`)
      .then((res) => res.data)
    console.log(response.data)

    // setCurrentActive()
  }

  const columns: ColumnDef<Active>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        return (
          <Button
            variant="secondary"
            size="icon-xs"
            onClick={() => fetchActive(row.getValue('id'))}
          >
            <Pencil size={12} />
          </Button>
        )
      },
    },
    {
      accessorKey: 'id',
      header: 'id',
    },
    {
      accessorKey: 'branch.label',
      header: 'cliente',
    },
    {
      accessorKey: 'costCenter.label',
      header: 'centro custo',
    },
    {
      accessorKey: 'equipmentCode',
      header: 'Equipamento código',
    },
    {
      accessorKey: 'description',
      header: 'Descrição tag',
    },
    {
      accessorKey: 'family.label',
      header: 'Familia',
    },
    {
      accessorKey: 'typeEquipment.label',
      header: 'equipamento tipo',
    },
    {
      accessorKey: 'inGuarantee',
      header: 'Em garantia?',
    },
    {
      accessorKey: 'plate',
      header: 'Placa',
    },
    {
      accessorKey: 'chassi',
      header: 'chassi',
    },
    {
      accessorKey: 'serie',
      header: 'n° serie',
    },
    {
      accessorKey: 'status',
      header: 'Status Equipamento',
    },
    {
      accessorKey: 'observation',
      header: 'observação',
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={data || []} />
      <ActiveForm
        open={!!currentActive}
        onOpenChange={(open) =>
          setCurrentActive(open ? currentActive : undefined)
        }
        mode="edit"
        onSubmit={handleEditActive}
        defaultValues={currentActive!}
      />
    </>
  )
}

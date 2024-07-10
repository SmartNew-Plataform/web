'use client'
import { TankAndTrainResponse } from '@/@types/fuelling-tank'
import { AlertModal } from '@/components/alert-modal'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { FuelModal } from './SheetFuelModal'
import { TankModal } from './tank-modal'

export function Table() {
  async function fetchSelects() {
    const response = await api.get('fuelling/tank').then((res) => res.data)
    return response.data
  }

  const { data, refetch } = useQuery({
    queryKey: ['fuelling/create/data'],
    queryFn: fetchSelects,
  })

  const [editData, setEditData] = useState<TankAndTrainResponse | undefined>()
  const [tankIdToDelete, setTankIdToDelete] = useState<number | undefined>()
  const [tankIdToCompartment, setTankIdToCompartment] = useState<
    string | undefined
  >(undefined)

  async function handleDeleteTank() {
    const response = await api.delete(`fuelling/tank/${tankIdToDelete}`)

    if (response.status !== 200) return

    toast({
      title: 'Tanque deletado com sucesso!',
      variant: 'success',
    })
    refetch()
  }

  const columns: ColumnDef<TankAndTrainResponse>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell({ row }) {
        const id = row.getValue('id') as string
        const data = row.original
        console.log(id)

        return (
          <div className="flex gap-2">
            <Button onClick={() => setEditData(data)} size="icon-xs">
              <Pencil size={12} />
            </Button>
            <Button
              onClick={() => setTankIdToDelete(data.id)}
              variant="destructive"
              size="icon-xs"
            >
              <Trash2 size={12} />
            </Button>
            <Button
              onClick={() => setTankIdToCompartment(id)}
              variant="outline"
              size="icon-xs"
            >
              <Plus size={12} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'model',
      header: 'tag',
    },
    {
      accessorKey: 'tank',
      header: 'Descrição',
    },
    {
      accessorKey: 'capacity',
      header: 'Capacidade maxima',
    },
    {
      accessorKey: 'branch.label',
      header: 'Filial',
    },
    {
      accessorKey: 'compartment',
      header: 'Combustível',
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={data || []} />
      <TankModal
        mode="edit"
        open={!!editData}
        defaultValues={editData}
        onOpenChange={(open) => setEditData(open ? editData : undefined)}
      />
      <FuelModal
        tankId={tankIdToCompartment || ''}
        open={!!tankIdToCompartment}
        onOpenChange={(open) => {
          setTankIdToCompartment(open ? tankIdToCompartment : undefined)
        }}
      />

      <AlertModal
        open={!!tankIdToDelete}
        onOpenChange={(open) =>
          setTankIdToDelete(open ? tankIdToDelete : undefined)
        }
        onConfirm={handleDeleteTank}
      />
    </>
  )
}

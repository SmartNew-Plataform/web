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
import { TrainModal } from './train-modal'

export function Table() {
  async function fetchSelects() {
    const response = await api.get('fuelling/train').then((res) => res.data)
    return response.data
  }

  const { data, refetch } = useQuery({
    queryKey: ['fuelling/train/data'],
    queryFn: fetchSelects,
    refetchInterval: 1 * 30 * 1000,
  })

  const [editData, setEditData] = useState<TankAndTrainResponse | undefined>()
  const [trainIdToDelete, setTrainIdToDelete] = useState<number | undefined>()
  const [trainIdToCompartment, setTrainIdToCompartment] = useState<
    string | undefined
  >(undefined)

  async function handleDeleteTrain() {
    const response = await api.delete(`fuelling/train/${trainIdToDelete}`)

    if (response.status !== 200) return

    toast({
      title: 'Comboio deletado com sucesso!',
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
              onClick={() => setTrainIdToDelete(data.id)}
              variant="destructive"
              size="icon-xs"
            >
              <Trash2 size={12} />
            </Button>
            <Button
              onClick={() => setTrainIdToCompartment(id)}
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
      accessorKey: 'tag',
      header: 'tag',
    },
    {
      accessorKey: 'train',
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
      <TrainModal
        mode="edit"
        open={!!editData}
        defaultValues={editData}
        onOpenChange={(open) => setEditData(open ? editData : undefined)}
      />
      <FuelModal
        trainId={trainIdToCompartment || ''}
        open={!!trainIdToCompartment}
        onOpenChange={(open) => {
          setTrainIdToCompartment(open ? trainIdToCompartment : undefined)
        }}
      />

      <AlertModal
        open={!!trainIdToDelete}
        onOpenChange={(open) =>
          setTrainIdToDelete(open ? trainIdToDelete : undefined)
        }
        onConfirm={handleDeleteTrain}
      />
    </>
  )
}

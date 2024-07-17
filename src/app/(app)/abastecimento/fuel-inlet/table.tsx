'use client'
import { FuelInlet } from '@/@types/fuelling-tank'
import { AlertModal } from '@/components/alert-modal'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { TankModal } from './Primary-modal'
import { FuelModal } from './SheetFuelModal'

export function Table() {
  async function fetchSelects() {
    const response = await api.get('fuelling/input').then((res) => res.data)
    return response.data
  }

  const { data, refetch } = useQuery({
    queryKey: ['fuelling/create/data'],
    queryFn: fetchSelects,
  })

  const [editData, setEditData] = useState<FuelInlet | undefined>()
  const [tankIdToDelete, setTankIdToDelete] = useState<number | undefined>()
  const [tankIdToCompartment, setTankIdToCompartment] = useState<
    string | undefined
  >(undefined)

  async function handleDeleteTank() {
    const response = await api.delete(`fuelling/tank/${tankIdToDelete}`)

    if (response.status !== 200) return

    toast({
      title: 'Entrada deletado com sucesso!',
      variant: 'success',
    })
    refetch()
  }

  const columns: ColumnDef<FuelInlet>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell({ row }) {
        const id = row.getValue('id') as string
        const data = row.original

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
      accessorKey: 'fiscalNumber',
      header: 'Nota fiscal',
    },
    {
      accessorKey: 'bound.text',
      header: 'Equipamento abastecido',
    },
    {
      accessorKey: 'provider.text',
      header: 'Fornecedor',
    },
    {
      accessorKey: 'total',
      header: 'Valor total',
    },
    {
      accessorKey: 'date',
      header: 'Data',
      cell({ getValue }) {
        const date = getValue() as string
        return dayjs(date).format('DD/MM/YYYY')
      },
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

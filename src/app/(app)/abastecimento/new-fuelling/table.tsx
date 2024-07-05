'use client'
import { ListFuelling } from '@/@types/fuelling-fuelling'
import { AlertModal } from '@/components/alert-modal'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { FuelForm, SupplyFormData } from './fuelForm'

export function Table() {
  const [fuellingIdToDelete, setFuellingIdToDelete] = useState<
    number | undefined
  >()

  const [fuellingIdToEdit, setFuellingIdToEdit] = useState<number | undefined>()

  const [editingFuelData, setEditingFuelData] = useState()

  async function fetchSelects() {
    const response = await api.get('fuelling/info').then((res) => res.data)
    return response.data
  }

  const { data, refetch } = useQuery({
    queryKey: ['fuelling/data'],
    queryFn: fetchSelects,
  })

  async function handleDeleteFuelling() {
    const response = await api.delete(`fuelling/${fuellingIdToDelete}`)

    if (response.status !== 200) return

    toast({
      title: 'Abastecimento deletado com sucesso!',
      variant: 'success',
    })
    refetch()
  }

  async function fecthFuelling(id: number) {
    try {
      const response = await api.get(`fuelling/${id}`)
      if (response.status === 200) {
        console.log(response.data)
        const { data } = response.data

        const editableTemp = {
          type: data.type,
          typeSupplier: data.tank
            ? 'tank'
            : data.train
              ? 'train'
              : data.post
                ? 'post'
                : null,
          driver: data?.driver?.value ?? null,
          odometerPrevious: data.odometerLast,
          odometer: data.odometer,
          receipt: data.requestNumber,
          request: data.fiscalNumber,
          date: dayjs(data.date).format('YYYY-MM-DD'),
          equipment: data.equipment.value.toString(),
          counter: data.counter,
          last: data.counterLast,
          fuel: '14',
          quantity: data.quantidade,
          consumption: Number(data.consumption),
          value: data.value,
          compartment: data.tankFuelling
            ? data.tankFuelling.value.toString()
            : data.trainFuelling
              ? data.trainFuelling.value.toString()
              : null,
          tank: data?.tank?.value.toString() ?? null,
          train: data?.train?.value.toString() ?? null,
          post: data?.post?.value.toString() ?? null,
          supplier: data?.supplier ?? null,
          comments: data?.observation ?? '',
        }
        console.log(editableTemp)

        setEditingFuelData(editableTemp)
        setFuellingIdToEdit(id)
        refetch()
      } else {
        toast({
          title: 'Erro ao buscar abastecimento',
          description: 'Não foi possível buscar os dados do abastecimento.',
        })
      }
    } catch (error) {
      console.error('Erro ao buscar abastecimento:', error)
      toast({
        title: 'Erro ao buscar abastecimento',
        description:
          'Ocorreu um erro ao tentar buscar os dados do abastecimento.',
      })
    }
  }
  async function handleEditFuelling(data: SupplyFormData) {
    try {
      const response = await api.put(`fuelling/${fuellingIdToEdit}`, {
        ...data,
        equipmentId: data.equipment,
        type: data.type,
        fuelStationId: data.post,
        trainId: data.train,
        tankId: data.tank,
        fuelId: data.fuel,
        compartmentId: data.compartment,
        numberRequest: data.request,
        fiscalNumber: data.receipt,
        value: data.value,
        currentCounter: data.last,
        observation: data.comments,
        counterLast: data.last,
        odometerLast: data.odometerPrevious,
      })

      if (response.status === 200) {
        toast({
          title: 'Abastecimento editado com sucesso!',
          variant: 'success',
        })
        refetch()
      } else {
        toast({
          title: 'Erro ao editar abastecimento',
          description: 'Não foi possível editar o abastecimento.',
        })
      }
    } catch (error) {
      console.error('Erro ao editar abastecimento:', error)
      toast({
        title: 'Erro ao editar abastecimento',
        description: 'Ocorreu um erro ao tentar editar o abastecimento.',
      })
    }
  }

  const columns: ColumnDef<ListFuelling>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell({ row }) {
        const id = row.getValue('id') as number
        const data = row.original
        console.log(id)

        return (
          <div className="flex gap-2">
            <Button size="icon-xs" onClick={() => fecthFuelling(data.id)}>
              <Pencil size={12} />
            </Button>
            <Button
              onClick={() => setFuellingIdToDelete(data.id)}
              variant="destructive"
              size="icon-xs"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'driver',
      header: 'Motorista',
    },
    {
      accessorKey: 'fuelStation',
      header: 'Nome do Posto',
    },

    {
      accessorKey: 'fiscalNumber',
      header: 'Nota fiscal',
    },
    {
      accessorKey: 'requestNumber',
      header: 'Número requerimento',
    },
    {
      accessorKey: 'date',
      header: 'Data abastecimento',
      cell({ getValue }) {
        const date = getValue() as string
        return dayjs(date).format('DD/MM/YYYY')
      },
    },
    {
      accessorKey: 'equipment',
      header: 'Equipamento',
    },
    {
      accessorKey: 'type',
      header: 'Tipo consumo',
    },
    {
      accessorKey: 'counter',
      header: 'Contador atual',
    },
    {
      accessorKey: 'counterLast',
      header: 'Contador anterior',
    },
    {
      accessorKey: 'tankFuelling',
      header: 'Combustivel',
    },
    {
      accessorKey: 'quantidade',
      header: 'Quantidade',
    },
    {
      accessorKey: 'consumption',
      header: 'Cons Realizado',
    },
    {
      accessorKey: 'value',
      header: 'Valor UN',
    },
    {
      accessorKey: 'total',
      header: 'Custo total',
    },
    {
      accessorKey: 'observation',
      header: 'Observações',
    },
  ]
  return (
    <>
      <DataTable columns={columns} data={data || []} />

      <AlertModal
        open={!!fuellingIdToDelete}
        onOpenChange={(open) =>
          setFuellingIdToDelete(open ? fuellingIdToDelete : undefined)
        }
        onConfirm={handleDeleteFuelling}
      />

      <FuelForm
        open={!!fuellingIdToEdit}
        onOpenChange={(open) =>
          setFuellingIdToEdit(open ? fuellingIdToEdit : undefined)
        }
        defaultValues={editingFuelData}
        mode="edit"
        onSubmit={handleEditFuelling}
      />
    </>
  )
}

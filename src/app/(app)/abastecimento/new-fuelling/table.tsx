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
import { useEffect, useState } from 'react'
import { FuelForm, SupplyFormData } from './fuelForm'

interface FuelingData {
  id: number
  type: string
  driver: {
    value: string
  }
  requestNumber: string
  fiscalNumber: string
  date: string
  equipment: {
    value: string
  }
  quantidade: number
  consumption: number
  value: number
  observation?: string
  odometerPrevious?: number
  odometer?: number
  counter?: number
  last?: number
  tankFuelling?: {
    value: string
  }
  trainFuelling?: {
    value: string
  }
  tank?: {
    value: string
  }
  train?: {
    value: string
  }
  post?: {
    value: string
  }
  supplier?: string
}

export function Table() {
  const [fuellingIdToDelete, setFuellingIdToDelete] = useState<
    number | undefined
  >()
  const [fuellingIdToEdit, setFuellingIdToEdit] = useState<number | undefined>()
  const [editingFuelData, setEditingFuelData] = useState<SupplyFormData>()

  const { data: fuelingList, refetch: refetchFuelingList } = useQuery({
    queryKey: ['fuelling/data'],
    queryFn: fetchFuelingList,
  })

  async function fetchFuelingList() {
    const response = await api.get('fuelling/info').then((res) => res.data)
    return response.data
  }

  async function fetchFueling(id: number) {
    try {
      const response = await api.get<FuelingData>(`fuelling/${id}`)
      if (response.status === 200) {
        const { data } = response.data
        setEditingFuelData(mapFuelingDataToSupplyFormData(data))
        setFuellingIdToEdit(id)
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

  useEffect(() => {
    if (fuellingIdToEdit !== undefined) {
      fetchFueling(fuellingIdToEdit)
    }
  }, [fuellingIdToEdit])

  function mapFuelingDataToSupplyFormData(data: FuelingData): SupplyFormData {
    return {
      type: data.type,
      typeSupplier: data.tank
        ? 'tank'
        : data.train
          ? 'train'
          : data.post
            ? 'post'
            : '',
      driver: data.driver?.value ?? '',
      receipt: data.requestNumber,
      request: data.fiscalNumber,
      date: dayjs(data.date).format('YYYY-MM-DD'),
      equipment: data.equipment.value.toString(),
      fuel: '14',
      quantity: data.quantidade,
      consumption: Number(data.consumption),
      value: data.value,
      comments: data?.observation ?? '',
      odometerPrevious: data.odometerPrevious ?? 0,
      odometer: data.odometer ?? 0,
      counter: data.counter ?? 0,
      last: data.last ?? 0,
      compartment: data.tankFuelling
        ? data.tankFuelling.value.toString()
        : data.trainFuelling
          ? data.trainFuelling.value.toString()
          : '',
      tank: data?.tank?.value.toString() ?? '',
      train: data?.train?.value.toString() ?? '',
      post: data?.post?.value ?? '',
      supplier: data?.supplier ?? '',
    }
  }

  async function handleEditFuelling(data: SupplyFormData) {
    const fuelStationId = data.post ? String(data.post) : null
    const trainId = data.train ? String(data.train) : null
    try {
      const response = await api.put(`fuelling/${fuellingIdToEdit}`, {
        ...data,
        equipmentId: data.equipment,
        type: data.type,
        fuelStationId,
        trainId,
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
        refetchFuelingList()
        setFuellingIdToEdit(undefined)
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
        description: 'Você só pode editar o ultimo abastecimento feito.',
      })
    }
  }

  async function handleDeleteFuelling() {
    try {
      const response = await api.delete(`fuelling/${fuellingIdToDelete}`)
      if (response.status === 200) {
        toast({
          title: 'Abastecimento deletado com sucesso!',
          variant: 'success',
        })
        refetchFuelingList()
        setFuellingIdToDelete(undefined)
      } else {
        toast({
          title: 'Erro ao deletar abastecimento',
          description: 'Não foi possível deletar o abastecimento.',
        })
      }
    } catch (error) {
      console.error('Erro ao deletar abastecimento:', error)
      toast({
        title: 'Erro ao deletar abastecimento',
        description: 'Você só pode deletar o ultimo abastecimento feito.',
      })
    }
  }

  const columns: ColumnDef<ListFuelling>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell({ row }) {
        // const id = row.getValue('id') as number
        const data = row.original

        return (
          <div className="flex gap-2">
            <Button size="icon-xs" onClick={() => fetchFueling(data.id)}>
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
      <DataTable columns={columns} data={fuelingList || []} />

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

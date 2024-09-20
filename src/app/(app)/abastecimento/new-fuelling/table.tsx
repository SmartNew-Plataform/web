'use client'
import { FuelingData, ListFuelling } from '@/@types/fuelling-fuelling'
import { AlertModal } from '@/components/alert-modal'
import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useFilterFuelling } from '@/store/fuelling/filter-newfuelling'
import { useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Info, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FuelForm, SupplyFormData } from './fuelForm'
import { ObservationModal } from './observationsModal'

export function Table() {
  const queryClient = useQueryClient()
  const { filters } = useFilterFuelling()
  const [fuellingIdToDelete, setFuellingIdToDelete] = useState<
    number | undefined
  >()
  const [fuellingIdToEdit, setFuellingIdToEdit] = useState<number | undefined>()
  const [editingFuelData, setEditingFuelData] = useState<SupplyFormData>()
  const [observationData, setObservationData] = useState<string | undefined>()
  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false)

  async function fetchFuelingList(params: { index: number; perPage: number }) {
    const response = await api
      .get('fuelling/info', {
        params: {
          ...params,
          ...filters,
        },
      })
      .then((res) => res.data)

    return response
  }

  async function fetchFueling(id: number) {
    try {
      const response = await api.get<FuelingData>(`fuelling/${id}`)

      if (response.status === 200) {
        const data = response.data
        const mappedData = mapFuelingDataToSupplyFormData(data)
        setEditingFuelData(mappedData)
        setFuellingIdToEdit(id)
      } else {
        console.error('Erro ao buscar abastecimento:', response.statusText)
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

  async function fetchObservation(id: number) {
    try {
      const response = await api.get<FuelingData>(`fuelling/${id}`)
      if (response.status === 200) {
        const data = response.data
        setObservationData(data.data.observation ?? '')
        setIsObservationModalOpen(true)
      } else {
        toast({
          title: 'Erro ao buscar observação',
          description: 'Não foi possível buscar a observação do abastecimento.',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro ao buscar observação',
        description:
          'Ocorreu um erro ao tentar buscar a observação do abastecimento.',
      })
    }
  }

  function mapFuelingDataToSupplyFormData({
    data,
  }: FuelingData): SupplyFormData {
    return {
      type: data.type,
      typeSupplier: data.tank
        ? 'tank'
        : data.train
          ? 'train'
          : data.post
            ? 'post'
            : '',
      typeEquipment: data.equipment.type,
      driver: data.driver?.value ?? '',
      receipt: data.requestNumber ?? '',
      request: data.fiscalNumber ?? '',
      date: dayjs(data.date).format('YYYY-MM-DD'),
      equipment: data.equipment.value.toString(),
      fuel: data.fuel.value.toString(),
      quantity: Number(data.quantidade),
      consumption: data.consumption ?? 0,
      value: data.value,
      comments: data.observation ?? '',
      odometerPrevious: data.odometerPrevious ?? 0,
      odometer: data.odometer ?? 0,
      counter: data.counter ?? 0,
      last: data.counterLast ?? 0,
      compartment: data.tankFuelling
        ? data.tankFuelling.value.toString()
        : data.trainFuelling?.value.toString()
          ? data.trainFuelling.value.toString()
          : '',
      tank: data.tank?.value.toString() ?? '',
      train: data.train?.value.toString() ?? '',
      post: data.post?.value.toString() ?? '',
    }
  }

  async function handleEditFuelling(data: SupplyFormData) {
    const fuelStationId = data.post ? String(data.post) : null
    const trainId = data.train ? String(data.train) : null
    const tankId = data.tank ? String(data.tank) : null
    const response = await api.put(`fuelling/${fuellingIdToEdit}`, {
      ...data,
      equipmentId: data.equipment,
      type: data.type,
      fuelStationId,
      trainId,
      tankId,
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
      queryClient.refetchQueries(['fuelling/data'])
      queryClient.refetchQueries(['fuelling/list-fuel'])
      setFuellingIdToEdit(undefined)
      return response
    } else {
      toast({
        title: 'Erro ao editar abastecimento',
        description: 'Não foi possível editar o abastecimento.',
      })
      return response
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
        queryClient.refetchQueries(['fuelling/data'])
        queryClient.refetchQueries(['fuelling/list-fuel'])
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
        const id = row.getValue('id') as number
        const data = row.original

        return (
          <div className="flex gap-2">
            <Button size="icon-xs" onClick={() => fetchFueling(id)}>
              <Pencil size={12} />
            </Button>
            <Button
              onClick={() => setFuellingIdToDelete(data.id)}
              variant="destructive"
              size="icon-xs"
            >
              <Trash2 size={12} />
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => fetchObservation(id)}
            >
              <Info size={16} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'fuelStation',
      header: 'Nome do Posto',
    },

    // {
    //   accessorKey: 'fiscalNumber',
    //   header: 'Nota fiscal',
    // },
    // {
    //   accessorKey: 'requestNumber',
    //   header: 'Número requerimento',
    // },
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
      cell({ getValue }) {
        const couter = Number(getValue())
        return isNaN(couter) ? '-' : couter.toFixed(2).replace('.', ',')
      },
    },
    {
      accessorKey: 'counterLast',
      header: 'Contador anterior',
      cell({ getValue }) {
        const couterLast = Number(getValue())
        return isNaN(couterLast) ? '-' : couterLast.toFixed(2).replace('.', ',')
      },
    },
    {
      accessorKey: 'compartment',
      header: 'Combustível',
    },
    {
      accessorKey: 'quantidade',
      header: 'Quantidade',
      cell({ getValue }) {
        const quantidade = Number(getValue())
        return isNaN(quantidade) ? '-' : quantidade.toFixed(2).replace('.', ',')
      },
    },
    {
      accessorKey: 'consumption',
      header: 'Cons Realizado',
      cell({ getValue }) {
        const consumption = Number(getValue())
        return isNaN(consumption)
          ? '-'
          : consumption.toFixed(2).replace('.', ',')
      },
    },
    {
      accessorKey: 'value',
      header: 'Valor UN',
      cell({ getValue }) {
        const value = Number(getValue())
        return isNaN(value) ? '-' : value.toFixed(2).replace('.', ',')
      },
    },
    {
      accessorKey: 'total',
      header: 'Custo Total',
      cell({ getValue }) {
        const total = Number(getValue())
        return isNaN(total) ? '-' : total.toFixed(2).replace('.', ',')
      },
    },
    // {
    //   accessorKey: 'observation',
    //   header: 'Observações',
    // },
  ]

  return (
    <>
      <DataTableServerPagination
        id={['fuelling/data', ...Object.values(filters || {})]}
        columns={columns}
        fetchData={fetchFuelingList}
      />

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

      <ObservationModal
        open={isObservationModalOpen}
        onOpenChange={setIsObservationModalOpen}
        observation={observationData}
      />
    </>
  )
}

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

  async function handleEditFuelling(data: SupplyFormData) {
    try {
      const currentDataResponse = await api.get(`fuelling/${fuellingIdToEdit}`)
      const currentData = currentDataResponse.data

      const updatedData = {
        ...currentData,
        type: data.type ?? currentData.type,
        typeSupplier: data.typeSupplier ?? currentData.typeSupplier,
        driver: data.driver ?? currentData.driver,
        odometerLast: data.odometerPrevious ?? currentData.odometerLast,
        currentCounter: data.odometer ?? currentData.currentCounter,
        fiscalNumber: data.receipt ?? currentData.fiscalNumber,
        numberRequest: data.request ?? currentData.numberRequest,
        date: data.date ?? currentData.date,
        equipmentId: data.equipment ?? currentData.equipmentId,
        counter: data.counter ?? currentData.counter,
        counterLast: data.last ?? currentData.counterLast,
        fuelId: data.fuel ?? currentData.fuelId,
        quantity: data.quantity ?? currentData.quantity,
        consumption: data.consumption ?? currentData.consumption,
        value: data.value ?? currentData.value,
        compartmentId: data.compartment ?? currentData.compartmentId,
        tankId: data.tank ?? currentData.tankId,
        trainId: data.train ?? currentData.trainId,
        fuelStationId: data.post ?? currentData.fuelStationId,
        supplier: data.supplier ?? currentData.supplier,
        observation: data.comments ?? currentData.observation,
      }

      const response = await api.put(
        `fuelling/${fuellingIdToEdit}`,
        updatedData,
      )

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
        const id = row.getValue('id') as string
        const data = row.original
        console.log(id)

        return (
          <div className="flex gap-2">
            <Button size="icon-xs" onClick={() => setFuellingIdToEdit(data.id)}>
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
        mode="edit"
        onSubmit={handleEditFuelling}
      />
    </>
  )
}

'use client'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useLoading } from '@/store/loading-store'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FileBarChart, ListFilter, Plus } from 'lucide-react'
import { useState } from 'react'
import { FuelForm, SupplyFormData } from './fuelForm'

interface SupplyFormProps {
  id: number
  type: string
  typeSupplier: string
  driver: string
  odometerPrevious?: number
  odometer?: number
  receipt?: string
  request?: string
  date: string
  equipment: string
  counter: number
  last: number
  fuel?: string
  quantity: number
  consumption: number
  value: number
  compartment?: string
  tank?: string
  train?: string
  post?: string
  supplier?: string
  comments?: string
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  async function fetchSelects() {
    const response = await api.get('fuelling/info').then((res) => res.data)
    return response.data
  }

  const { refetch } = useQuery({
    queryKey: ['fuelling/data'],
    queryFn: fetchSelects,
  })

  const loading = useLoading()

  async function handleCreateFuelling(data: SupplyFormData) {
    const response = await api.post('fuelling/', {
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

    if (response.status !== 201) return

    toast({
      title: 'Abastecimento criado com sucesso!',
      variant: 'success',
    })

    refetch()
  }

  async function fetchDataTable(params: {
    index: number | null
    perPage: number | null
  }) {
    return api
      .get('fuelling/info', {
        params,
      })
      .then((res) => res.data)
  }

  async function handleGenerateExcel() {
    loading.show()
    const data: { rows: SupplyFormProps[] } | undefined = await fetchDataTable({
      index: null,
      perPage: null,
    })
    loading.hide()

    if (!data?.rows) return
    loading.show()
    await fetch('https://excel-api.smartnewsistemas.com.br/exportDefault', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        currencyFormat: [],
        title: 'Abastecimentos',
        data: data.rows.map((item) => ({
          id: item.id,
          Posto: item.post,
          'data de abertura': item.date,
          Equipamento: item.equipment,
          'Tipo de consumo': item.consumption,
          'Contador atual': item.counter,
          'Contador anterior': item.last,
          Combustível: item.fuel,
          Quantidade: item.quantity,
          'Consumo realizado': item.consumption,
          'Valor unitário': item.value,
          // 'Custo total': item.receipt,
        })),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const a = document.createElement('a')
        a.href = url
        a.download = `abastecimentos_${dayjs().format('DD-MM-YYYY-HH-mm-ss')}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .catch((error) => console.error(error))
    loading.hide()
  }

  return (
    <PageHeader>
      <h2 className="text-xl font-semibold text-slate-600">
        Registrar abastecimento
      </h2>
      <div className="flex gap-4">
        <Button>
          <ListFilter size={16} />
          Filtrar
        </Button>
        <Button onClick={handleGenerateExcel}>
          <FileBarChart size={16} />
          Excel
        </Button>
        <Button onClick={() => setIsOpen(true)}>
          <Plus size={16} />
          Novo abastecimento
        </Button>
      </div>
      <FuelForm
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleCreateFuelling}
        mode="create"
      />
    </PageHeader>
  )
}

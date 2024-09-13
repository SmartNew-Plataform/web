'use client'
import { FuellingResponse, Product } from '@/@types/fuelling/fuelling'
import { Form } from '@/components/form'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useFilterFuelling } from '@/store/fuelling/filter-newfuelling'
import { useLoading } from '@/store/loading-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Eraser, FileBarChart, ListFilter, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { FuelForm, SupplyFormData } from './fuelForm'

const filterFormSchema = z.object({
  equipment: z.string().optional(),
  type: z.string().optional(),
  product: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export type FuellingFilteFormData = z.infer<typeof filterFormSchema>

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { setFilter } = useFilterFuelling()
  const loading = useLoading()
  const queryClient = useQueryClient()

  const formFilter = useForm<FuellingFilteFormData>({
    resolver: zodResolver(filterFormSchema),
  })

  const { handleSubmit, reset } = formFilter

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

    if (response.status !== 201) return response

    toast({
      title: 'Abastecimento criado com sucesso!',
      variant: 'success',
    })

    return response
  }

  const { data: allEquipmentOptions = [] } = useQuery({
    queryKey: ['system/choices/equipment'],
    queryFn: async () => {
      const response = await api.get('/system/choices/equipment')
      return response.data.data || []
    },
  })

  const { data: allProductOptions = [] } = useQuery({
    queryKey: ['fuelling/product'],
    queryFn: async () => {
      const response = await api.get<{ data: Product }>('fuelling/product')
      return response.data.data.map((product) => ({
        value: product.id.toString(),
        label: product.description,
      }))
    },
  })

  async function handleGenerateExcel() {
    loading.show()
    const data: { rows: FuellingResponse[] } | undefined =
      queryClient.getQueryData(['fuelling/data'])
    loading.hide()

    if (!data) return
    loading.show()
    await fetch('https://excel-api.smartnewservices.com.br/exportDefault', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        currencyFormat: [],
        title: 'Abastecimentos',
        data: data.rows.map((item) => ({
          Id: item.id,
          Posto: item.fuelStation,
          'Data de abertura': dayjs(item.date).format('DD-MM-YYYY-HH-mm-ss'),
          Equipamento: item.equipment,
          'Tipo de consumo': Number(item.consumption)
            .toFixed(2)
            .replace('.', ','),
          'Contador atual': Number(item.counter).toFixed(2).replace('.', ','),
          'Contador anterior': Number(item.counterLast)
            .toFixed(2)
            .replace('.', ','),
          Combustível: item.compartment,
          Quantidade: Number(item.quantidade).toFixed(2).replace('.', ','),
          'Consumo realizado': Number(item.consumption)
            .toFixed(2)
            .replace('.', ','),
          'Valor unitário': Number(item.value).toFixed(2).replace('.', ','),
          'Valor total': Number(item.total).toFixed(2).replace('.', ','),
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

  async function handleFilter(data: FuellingFilteFormData) {
    setFilter(data)
  }

  function handleResetFilters() {
    reset({ equipment: '', type: '', product: '', dateFrom: '', dateTo: '' })
    setFilter({})
  }

  return (
    <PageHeader>
      <h2 className="text-xl font-semibold text-slate-600">
        Registrar abastecimento
      </h2>
      <div className="flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <ListFilter size={16} />
              Filtrar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-max">
            <FormProvider {...formFilter}>
              <form
                onSubmit={handleSubmit(handleFilter)}
                className="flex w-full flex-col gap-3"
              >
                <Form.Field>
                  <Form.Label>Equipamento</Form.Label>
                  <Form.Select
                    className="max-w-sm"
                    name="equipment"
                    placeholder="Selecione o equipamento"
                    options={allEquipmentOptions}
                  />
                </Form.Field>

                <Form.Field>
                  <Form.Label>Tipo:</Form.Label>
                  <Form.Select
                    className="max-w-sm"
                    name="type"
                    placeholder="Selecione a Família"
                    options={[
                      { value: 'INTERNO', label: 'INTERNO' },
                      { value: 'EXTERNO', label: 'EXTERNO' },
                    ]}
                  />
                </Form.Field>

                <Form.Field>
                  <Form.Label>Produto:</Form.Label>
                  <Form.Select
                    className="max-w-sm"
                    name="product"
                    placeholder="Selecione a Família"
                    options={allProductOptions}
                  />
                </Form.Field>

                <Form.Field>
                  <Form.Label>Data inicial:</Form.Label>
                  <Form.Input type="date" name="dateFrom" />
                </Form.Field>

                <Form.Field>
                  <Form.Label>Data final:</Form.Label>
                  <Form.Input type="date" name="dateTo" />
                </Form.Field>

                <Button type="submit" variant="secondary">
                  <Search className="h-4 w-4" />
                  Buscar
                </Button>

                <Button
                  variant="ghost"
                  type="reset"
                  onClick={handleResetFilters}
                >
                  <Eraser className="h-4 w-4" />
                  Limpar filtros
                </Button>
              </form>
            </FormProvider>
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={handleGenerateExcel}>
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

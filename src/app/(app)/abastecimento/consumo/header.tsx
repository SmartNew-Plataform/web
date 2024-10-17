'use client'
import { ConsuptionData } from '@/@types/fuelling/consuption'
import { Form } from '@/components/form'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { api } from '@/lib/api'
import { useFilterConsuption } from '@/store/fuelling/filter-consuption'
import { useLoading } from '@/store/loading-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Eraser, FileBarChart, Info, ListFilter, Search } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createBody } from './excel-export'

const filterFormSchema = z.object({
  equipmentId: z.string().optional(),
  familyId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export type FilterFormData = z.infer<typeof filterFormSchema>

export function Header() {
  const { filters, setFilter } = useFilterConsuption()
  const loading = useLoading()
  const queryClient = useQueryClient()

  const formFilter = useForm<FilterFormData>({
    resolver: zodResolver(filterFormSchema),
  })

  const { handleSubmit, reset, register, watch } = formFilter

  const { data: familyOptions = [] } = useQuery({
    queryKey: ['system/choices/family'],
    queryFn: async () => {
      const response = await api.get('/system/choices/family')
      return response.data.data || []
    },
  })

  const selectedFamily = watch('familyId')

  const { data: allEquipmentOptions = [] } = useQuery({
    queryKey: ['system/choices/equipment', selectedFamily],
    queryFn: async () => {
      const response = await api.get('/system/choices/equipment', {
        params: {
          familyId: selectedFamily,
        },
      })
      return response.data.data || []
    },
  })

  function calculeDifference(item: any) {
    const { expectedConsumption, consumptionMade } = item

    const difference =
      ((consumptionMade - expectedConsumption) / expectedConsumption) * 100

    const result = difference === Infinity ? 100 : difference

    return result
  }

  async function handleGenerateExcel() {
    loading.show()
    const dataExcel: ConsuptionData[] | undefined =
      await queryClient.getQueryData([
        'fuelling/report/family-consumption',
        ...Object.values(filters || {}),
      ])

    loading.hide()
    if (!dataExcel) return
    loading.show()
    const sheets = dataExcel.map(({ family, fuelling }) => {
      return {
        sheetName: family.replaceAll('/', '-'),
        recordHeader: '###recordHeader###',
        recordsFormat: '###recordsFormat###',
        records: fuelling.map((item) => [
          item.equipment,
          item.typeConsumption,
          Number(item.quantity),
          Number(item.total),
          Number(item.sumConsumption),
          Number(item.expectedConsumption),
          Number(item.consumptionMade),
          calculeDifference(item),
        ]),
      }
    })
    await fetch('https://excel.smartnewservices.com.br/export-unified', {
      method: 'POST',
      mode: 'cors',
      body: createBody(sheets),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const a = document.createElement('a')
        a.href = url
        a.download = `analise_de_consumo_${dayjs().format('DD-MM-YYYY-HH-mm-ss')}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .catch((error) => console.error(error))
    loading.hide()
  }

  async function handleFilter(data: FilterFormData) {
    setFilter(data)
  }

  function handleResetFilters() {
    reset({ familyId: '', dateFrom: '', dateTo: '' })
    setFilter({})
  }

  return (
    <PageHeader>
      <h1 className="text-xl font-semibold text-slate-600">
        Análise de consumo
      </h1>
      <div className="flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <ListFilter className="h-4 w-4" />
              Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-max">
            <FormProvider {...formFilter}>
              <form
                onSubmit={handleSubmit(handleFilter)}
                className="flex w-full flex-col gap-3"
              >
                <Form.Field>
                  <div className="flex items-center justify-between">
                    <Form.Label>Família:</Form.Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon-xs" variant="ghost">
                          <Info className="h-4 w-4 text-slate-700" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        className="max-w-[230px]"
                        alignOffset={20}
                      >
                        Esse campo busca as famílias disponíveis para filtro.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Form.Select
                    className="max-w-sm"
                    name="familyId"
                    placeholder="Selecione a Família"
                    options={familyOptions || []}
                  />
                </Form.Field>

                <Form.Field>
                  <Form.Label>Equipamento</Form.Label>
                  {allEquipmentOptions.length > 0 ? (
                    <Form.Select
                      className="max-w-sm"
                      name="equipmentId"
                      placeholder="Selecione o equipamento"
                      options={allEquipmentOptions || []}
                    />
                  ) : (
                    <p className="text-sm text-red-500">
                      Família sem nenhum equipamento.
                    </p>
                  )}
                </Form.Field>

                <Form.Field>
                  <Form.Label>Data inicial:</Form.Label>
                  <Form.Input type="date" {...register('dateFrom')} />
                </Form.Field>

                <Form.Field>
                  <Form.Label>Data final:</Form.Label>
                  <Form.Input type="date" {...register('dateTo')} />
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
      </div>
    </PageHeader>
  )
}

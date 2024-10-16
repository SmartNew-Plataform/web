/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { useCoreScreensStore } from '@/store/core-screens-store'
import { useLoading } from '@/store/loading-store'
import { useGridStore } from '@/store/smartlist/grid'
import { zodResolver } from '@hookform/resolvers/zod'
import { AES } from 'crypto-js'
import dayjs from 'dayjs'
import {
  Eraser,
  FileBarChart,
  FileBarChart2,
  Info,
  ListFilter,
  Plus,
  Search,
} from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { CreateChecklistSheet } from './create-checklist-sheet'

interface Checklist {
  id: number
  status: string
  startDate: string
  endDate: any
  model: string
  item: string
  user: string
  period: string
}

const filterFormSchema = z.object({
  filterText: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

type FilterFormData = z.infer<typeof filterFormSchema>

export function Header() {
  const formFilter = useForm<FilterFormData>({
    resolver: zodResolver(filterFormSchema),
  })

  const { checklistId } = useGridStore()

  const { changeFilter } = useCoreScreensStore(({ changeFilter }) => ({
    changeFilter,
  }))
  const loading = useLoading()

  const { handleSubmit, reset } = formFilter

  function handleFilter(data: FilterFormData) {
    console.log(data)

    changeFilter({
      filterText: data.filterText,
      period: {
        from: data.dateFrom,
        to: data.dateTo,
      },
    })
  }

  function handleResetFilters() {
    changeFilter({})
    reset({ filterText: '', dateFrom: '', dateTo: '' })
  }

  async function fetchDataTable(params: {
    index: number | null
    perPage: number | null
  }) {
    return api
      .get('/smart-list/check-list', {
        params,
      })
      .then((res) => res.data)
  }

  async function handleGenerateExcel() {
    loading.show()
    const data: { rows: Checklist[] } | undefined = await fetchDataTable({
      index: null,
      perPage: null,
    })
    loading.hide()

    if (!data?.rows) return
    loading.show()
    await fetch('https://excel-api.smartnewservices.com.br/exportDefault', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        currencyFormat: [],
        title: 'Ações',
        data: data.rows.map((item) => ({
          id: item.id,
          modelo: item.model,
          'data de abertura': item.startDate,
          turno: item.period,
          'ativo/diverso': item.item,
          usuário: item.user,
          status: item.status === 'open' ? 'Aberto' : 'Finalizado ',
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
        a.download = `checklists_${dayjs().format('DD-MM-YYYY-HH-mm-ss')}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .catch((error) => console.error(error))
    loading.hide()
  }

  async function handleGeneratePDF() {
    checklistId?.forEach((id) => {
      const hash = AES.encrypt(String(id), 'ask-checklist')
      window.open(
        `https://pdf.smartnewservices.com.br/generator/checklist/asks/?id=${hash}`,
      )
    })
  }

  return (
    <Card className="flex items-center justify-between rounded-md p-4">
      <h1 className="text-lg font-semibold text-slate-700">Checklist Grid</h1>
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleGenerateExcel}>
          <FileBarChart className="h-4 w-4" />
          Excel
        </Button>
        <Button variant="outline" onClick={handleGeneratePDF}>
          <FileBarChart2 className="h-4 w-4" />
          PDF
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
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
                    <Form.Label>Texto:</Form.Label>
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
                        Esse campo busca as colunas: id, turno, equipamento, e
                        usuário. O id so e filtrado quando digitado por
                        completo.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Form.Input
                    className="max-w-sm"
                    placeholder="Busca rapida"
                    name="filterText"
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

        <CreateChecklistSheet>
          <Button>
            <Plus size={16} />
            Novo
          </Button>
        </CreateChecklistSheet>
      </div>
    </Card>
  )
}

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
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { Eraser, FileBarChart, Info, ListFilter, Search } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const filterFormSchema = z.object({
  filterText: z.string().optional(),
  period: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
})

type FilterFormData = z.infer<typeof filterFormSchema>

export function HeaderInfo() {
  const formFilter = useForm<FilterFormData>({
    resolver: zodResolver(filterFormSchema),
  })

  const { changeFilter } = useCoreScreensStore(({ changeFilter }) => ({
    changeFilter,
  }))
  const loading = useLoading()

  const { handleSubmit, reset } = formFilter

  function handleFilter(data: FilterFormData) {
    changeFilter(data)
  }

  function handleResetFilters() {
    changeFilter({})
    reset({ filterText: '', period: undefined })
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
    const data = await fetchDataTable({ index: null, perPage: null })
    loading.hide()

    if (!data?.rows) return
    loading.show()
    await fetch('https://excel-api.smartnewsistemas.com.br/exportDefault', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        currencyFormat: [],
        title: 'Ações',
        data: data.rows.map((item: any) => ({
          id: item.id,
          'data de abertura': item.startDate,
          turno: item.period,
          equipamento: item.equipment,
          usuário: item.user,
          status: item.status,
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

  return (
    <Card className="flex items-center justify-between rounded-md p-4">
      <h1 className="text-lg font-semibold text-slate-700">Checklist Grid</h1>
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleGenerateExcel}>
          <FileBarChart className="h-4 w-4" />
          Excel
        </Button>
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
                  <Form.Label>Período:</Form.Label>
                  <Form.InputDateRange name="period" />
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
      </div>
    </Card>
  )
}

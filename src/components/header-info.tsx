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
import { useCoreScreensStore } from '@/store/core-screens-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info, ListFilter, Search } from 'lucide-react'
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

  const { handleSubmit } = formFilter

  function handleFilter(data: FilterFormData) {
    changeFilter(data)
  }

  return (
    <Card className="flex items-center justify-between rounded-md p-4">
      <h1 className="text-lg font-semibold text-slate-700">Checklist Grid</h1>
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
                    <TooltipContent className="max-w-[230px]" alignOffset={20}>
                      Esse campo busca as colunas: id, turno, equipamento, e
                      usuário. O id so e filtrado quando digitado por completo.
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
            </form>
          </FormProvider>
        </PopoverContent>
      </Popover>
    </Card>
  )
}

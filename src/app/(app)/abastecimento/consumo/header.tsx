'use client'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Eraser, Info, ListFilter, Search } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const filterFormSchema = z.object({
  equipment: z.string().optional(),
  family: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export type FilterFormData = z.infer<typeof filterFormSchema>

export function Header() {
  const { setFilter } = useFilterConsuption()

  const formFilter = useForm<FilterFormData>({
    resolver: zodResolver(filterFormSchema),
  })

  const { handleSubmit, reset, register, watch } = formFilter
  // const queryClient = useQueryClient()

  const { data: familyOptions = [] } = useQuery({
    queryKey: ['system/choices/family'],
    queryFn: async () => {
      const response = await api.get('/system/choices/family')
      return response.data.data || []
    },
  })

  const selectedFamily = watch('family')

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

  async function handleFilter(data: FilterFormData) {
    setFilter(data)
  }

  function handleResetFilters() {
    reset({ family: '', dateFrom: '', dateTo: '' })
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
                    name="family"
                    placeholder="Selecione a Família"
                    options={familyOptions || []}
                  />
                </Form.Field>

                <Form.Field>
                  <Form.Label>Equipamento</Form.Label>
                  <Form.Select
                    className="max-w-sm"
                    name="equipment"
                    placeholder="Selecione o equipamento"
                    options={allEquipmentOptions || []}
                  />
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
      </div>
    </PageHeader>
  )
}

'use client'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { FileUp, Plus, Search, X } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { FilterModal } from './filter-modal'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAccountStore } from '@/store/financial/account'
import { EmissionModal } from './emission-modal'
import dayjs from 'dayjs'
import { useToast } from '@/components/ui/use-toast'

const filterFormSchema = z.object({
  filterText: z.string().optional(),
  column: z.string().optional(),
  value: z.union([
    z.number(),
    z.string(),
    z.object({
      from: z.string(),
      to: z.string(),
    }),
  ]),
  emitted: z.boolean().optional(),
  status: z.array(z.string()).optional(),
  paymentMethod: z.array(z.string()).optional(),
})

export type FilterFormType = z.infer<typeof filterFormSchema>

export function Header() {
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const { selectedRows } = useAccountStore()

  const filterText = searchParams.get('filterText')
  const column = searchParams.get('column')
  const value = searchParams.get('value')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const status = searchParams.getAll('status') || ''
  const paymentMethod = searchParams.getAll('paymentMethod') || ''

  const hasFilters =
    searchParams.has('filterText') ||
    searchParams.has('column') ||
    searchParams.has('value') ||
    searchParams.has('status') ||
    searchParams.has('paymentMethod')

  const filterForm = useForm<FilterFormType>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      filterText: filterText ?? '',
      column: column ?? '',
      value:
        from && to
          ? {
              from: from || undefined,
              to: to || undefined,
            }
          : value ?? '',
      status: status ?? [''],
      paymentMethod: paymentMethod ?? [''],
    },
  })

  const { handleSubmit, reset } = filterForm

  function handleFilter({
    filterText,
    column,
    value,
    paymentMethod,
    status,
  }: FilterFormType) {
    const url = new URLSearchParams(searchParams.toString())
    console.log({
      filterText,
      column,
      value,
      paymentMethod,
      status,
    })

    if (filterText) {
      url.set('filterText', filterText)
    } else {
      url.delete('filterText')
    }

    if (column) {
      url.set('column', column)
    } else {
      url.delete('column')
    }

    if (value) {
      if (typeof value === 'object') {
        url.set('from', dayjs(value.from).format('YYYY-MM-DD'))
        url.set('to', dayjs(value.to).format('YYYY-MM-DD'))
      } else {
        url.delete('from')
        url.delete('to')
        url.set('value', String(value))
      }
    } else {
      url.delete('value')
      url.delete('from')
      url.delete('to')
    }

    url.delete('paymentMethod')
    if (paymentMethod) {
      paymentMethod.forEach((item) => url.append('paymentMethod', item))
    }

    url.delete('status')
    if (status) {
      status.forEach((item) => url.append('status', item))
    }

    router.replace(`${params.type}?${url.toString()}`)
  }

  function handleClearFilters() {
    const url = new URLSearchParams(searchParams.toString())

    url.delete('filterText')
    url.delete('column')
    url.delete('value')
    url.delete('from')
    url.delete('to')
    url.delete('status')
    url.delete('paymentMethod')

    reset({
      column: '',
      value: '',
      filterText: '',
      paymentMethod: [],
      status: [],
    })

    router.replace(`${params.type}?${url.toString()}`)
  }

  return (
    <PageHeader className="items-start">
      <FormProvider {...filterForm}>
        <form
          id="filter-form-emission"
          onSubmit={handleSubmit(handleFilter)}
          className="flex w-full items-start justify-between gap-4"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-zinc-700">
              Emissão - contas a {params.type}
            </h1>

            <div className="flex">
              <Input
                className="rounded-r-none"
                placeholder="Digite para filtrar"
                {...filterForm.register('filterText')}
              />
              <Button type="submit" className="rounded-l-none">
                <Search width={16} />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterModal />
            {hasFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                type="button"
              >
                <X width={16} />
                Limpar filtros
              </Button>
            )}
            <Button>
              <Plus width={16} />
              Novo
            </Button>
            <Button variant="secondary">
              <FileUp width={16} />
              Excel
            </Button>

            {selectedRows.length > 0 && <EmissionModal />}
          </div>
        </form>
      </FormProvider>
    </PageHeader>
  )
}

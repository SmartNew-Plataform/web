'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { useAccountStore } from '@/store/financial/account'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export function FilterModal() {
  const { columns } = useAccountStore()
  const { watch } = useFormContext()

  const { data } = useQuery({
    queryKey: ['financial/account/filtersSelects'],
    queryFn: async () => {
      const [statusRes, paymentTypeRes] = await Promise.all([
        await api.get('/financial/account/list-status').then((res) => res.data),
        await api
          .get('financial/account/list-type-payment')
          .then((res) => res.data),
      ])

      return {
        status: statusRes.data,
        paymentType: paymentTypeRes.data,
      }
    },
  })

  const filterType = {
    issue: Form.Input,
    expectDate: Form.PeriodInput,
    dateEmission: Form.PeriodInput,
    dueDate: Form.PeriodInput,
    prorogation: Form.PeriodInput,
    fiscalNumber: ({ name }: { name: string }) => (
      <Form.Input name={name} type="number" step="any" />
    ),
    totalItem: ({ name }: { name: string }) => (
      <Form.Input name={name} type="number" step="any" />
    ),
    valueToPay: ({ name }: { name: string }) => (
      <Form.Input name={name} type="number" step="any" />
    ),
    valuePay: ({ name }: { name: string }) => (
      <Form.Input name={name} type="number" step="any" />
    ),
  }

  const currentColumn = watch('column') as keyof typeof filterType
  const ColumnFilter = currentColumn ? filterType[currentColumn] : Form.Input

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <SlidersHorizontal width={16} />
          FIltros avançados
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form.Field>
          <Form.Label htmlFor="column-select">
            Selecione uma coluna para filtrar:
          </Form.Label>
          <Form.Select name="column" id="column-select" options={columns} />
          <Form.ErrorMessage field="column" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="column-text">Digite para filtrar:</Form.Label>
          <ColumnFilter name="value" />
          <Form.ErrorMessage field="value" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="status-select">Status:</Form.Label>
          <Form.MultiSelect
            name="status"
            id="status-select"
            options={data?.status || []}
          />
          <Form.ErrorMessage field="status" />
        </Form.Field>

        <Form.Field className="flex-row">
          <Form.Checkbox name="emitted" id="emitted-checkbox" />
          <Form.Label htmlFor="emitted-checkbox">Emitidos?</Form.Label>
          <Form.ErrorMessage field="emitted" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="payment-method-select">
            Método pagamento:
          </Form.Label>
          <Form.MultiSelect
            name="paymentMethod"
            id="payment-method-select"
            options={data?.paymentType || []}
          />
          <Form.ErrorMessage field="paymentMethod" />
        </Form.Field>

        <Button type="submit" form="filter-form-emission">
          <Search width={16} />
          Buscar
        </Button>
      </DialogContent>
    </Dialog>
  )
}

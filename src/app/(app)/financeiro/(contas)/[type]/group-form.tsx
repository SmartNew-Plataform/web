'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { currencyFormat } from '@/lib/currencyFormat'
import { useAccountStore } from '@/store/financial/account'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const groupFormSchema = z.object({
  bank: z.string({ required_error: 'Este campo e obrigatório!' }),
  paymentDate: z.coerce.date({ required_error: 'Este campo e obrigatório!' }),
  paid: z.boolean().optional(),
})

type GroupFormData = z.infer<typeof groupFormSchema>

type ResponseBankData = {
  id: number
  name: string
  negative: number
  balance: number
}

type BankData = {
  value: string
  label: string
  negative: number
  balance: number
}

interface GroupFormProps {
  balance?: number
  totalItems: number
  paid: boolean
  dueDate?: string
  bankId?: number
  groupId?: number
  emitted: boolean
}

export function GroupForm({
  totalItems,
  balance,
  bankId,
  groupId,
  paid,
  dueDate,
  emitted,
}: GroupFormProps) {
  const params = useParams()
  const { selectedRows } = useAccountStore()
  const { toast } = useToast()
  const groupForm = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      bank: bankId?.toString(),
      paymentDate: dueDate ? dayjs(dueDate).toDate() : undefined,
      paid,
    },
  })

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = groupForm

  async function fetchBanks() {
    const response = await api.get('/financial/account/list-bank').then((res) =>
      res.data.bank.map(({ id, name, ...rest }: ResponseBankData) => ({
        ...rest,
        value: id.toString(),
        label: name,
      })),
    )

    setValue('bank', bankId ? bankId.toString() : '')

    return response
  }

  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<BankData[]>({
    queryKey: ['financial/account/banks'],
    queryFn: fetchBanks,
    retry: false,
  })

  const bankValue = watch('bank')
  const currentBank = data?.find((bank) => bank.value === bankValue)
  const currentBalance = currentBank ? currentBank.balance : 0

  async function handleEmitterGroup(data: GroupFormData) {
    if (!emitted) {
      const response = await api
        .post('financial/account/emission', {
          bankId: Number(data.bank),
          type: params.type,
          splitId: selectedRows.map(({ id }) => id),
          dueDate: data.paymentDate,
        })
        .then((res) => res.data)

      if (response.inserted) {
        toast({
          title: 'Emitido com sucesso!',
          variant: 'success',
        })

        await queryClient.refetchQueries(['financial-emission-groups'])
      }
    } else {
      const response = await api
        .put(`financial/account/emission/${groupId}`, {
          bankId: Number(data.bank),
          type: params.type,
          dueDate: data.paymentDate,
          paid: data.paid,
        })
        .then((res) => res.data)

      if (response) {
        toast({
          title: 'Atualizado com sucesso!',
          variant: 'success',
        })
        await queryClient.refetchQueries(['financial-emission-groups'])
      }
    }
    console.log(data)
  }

  return (
    <FormProvider {...groupForm}>
      <form
        onSubmit={handleSubmit(handleEmitterGroup)}
        className="flex max-w-[50%] flex-1 flex-col gap-3"
      >
        <Form.Field>
          {isLoading ? (
            <Form.SkeletonField />
          ) : (
            <>
              <Form.Label htmlFor="bank-select">Banco:</Form.Label>
              <Form.Select
                disabled={paid}
                options={data || []}
                name="bank"
                id="bank-select"
              />
              <Form.ErrorMessage field="bank" />
            </>
          )}
        </Form.Field>

        <div className="flex flex-col gap-2">
          <span className="text-slate-600">Total:</span>
          <span className="text-2xl text-slate-700">
            {currencyFormat(balance || currentBalance)}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-slate-600">Diferença:</span>
          <span className="text-2xl text-slate-700">
            {currencyFormat((balance || currentBalance) - totalItems)}
          </span>
        </div>

        <Form.Field>
          <Form.Label htmlFor="payment-date-input">
            Data de pagamento:
          </Form.Label>
          <Form.DatePicker
            disabled={paid}
            name="paymentDate"
            id="payment-date-input"
          />
          <Form.ErrorMessage field="paymentDate" />
        </Form.Field>
        <Form.Field>
          <div className="flex gap-2">
            <Form.Checkbox
              disabled={!emitted || paid}
              name="paid"
              id="paid-checkbox"
            />
            <Form.Label htmlFor="paid-checkbox">Ja foi pago ?</Form.Label>
          </div>
          <Form.ErrorMessage field="paid" />
        </Form.Field>
        <Button loading={isSubmitting} disabled={paid || isSubmitting}>
          Enviar
        </Button>
      </form>
    </FormProvider>
  )
}

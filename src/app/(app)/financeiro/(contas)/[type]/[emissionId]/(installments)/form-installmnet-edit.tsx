'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useEmissionStore } from '@/store/financial/emission'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface FormInstallmentEditProps extends ComponentProps<typeof Dialog> {}

const formInstallmentSchema = z.object(
  {
    value: z.coerce.number(),
    dueDate: z.string(),
  },
  { required_error: 'Este campo não pode ser vazio!' },
)

type FormInstallmentData = z.infer<typeof formInstallmentSchema>

export function FormInstallmentEdit({ ...props }: FormInstallmentEditProps) {
  const installmentForm = useForm<FormInstallmentData>({
    resolver: zodResolver(formInstallmentSchema),
  })
  const { reset, handleSubmit } = installmentForm
  const { dataInstallmentEditing } = useEmissionStore(
    ({ dataInstallmentEditing }) => ({ dataInstallmentEditing }),
  )
  const params = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  useEffect(() => {
    reset({
      value: dataInstallmentEditing?.valuePay,
      dueDate: dayjs(dataInstallmentEditing?.dueDate).format('YYYY-MM-DD'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataInstallmentEditing])

  async function handleUpdateInstallment({
    dueDate,
    value,
  }: FormInstallmentData) {
    const response = await api.put(
      `/financial/account/finance/${params.emissionId}/installment/${dataInstallmentEditing?.id}`,
      {
        application: `blank_financeiro_emissao_${params.type}`,
        value,
        dueDate,
      },
    )

    if (response.status !== 200) return

    queryClient.refetchQueries(['finance/account/launch/installments'])

    toast({
      title: 'Parcela editada com sucesso!',
      variant: 'success',
    })
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...installmentForm}>
          <form
            onSubmit={handleSubmit(handleUpdateInstallment)}
            className="flex w-full flex-col gap-3"
          >
            <Form.Field>
              <Form.Label htmlFor="value">Valor parcela:</Form.Label>
              <Form.Input type="number" step="any" id="value" name="value" />
              <Form.ErrorMessage field="value" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="dueDate">Vencimento:</Form.Label>
              <Form.Input
                min={dayjs().format('YYYY-MM-DD')}
                type="date"
                step="any"
                id="dueDate"
                name="dueDate"
              />
              <Form.ErrorMessage field="dueDate" />
            </Form.Field>

            <Button>
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

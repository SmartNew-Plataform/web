/* eslint-disable react-hooks/exhaustive-deps */
import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useEmissionStore } from '@/store/financial/emission'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Bolt, Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const installmentFormSchema = z.object({
  paymentType: z.string({ required_error: 'Este campo e obrigatório' }),
  dueDate: z.string({ required_error: 'Este campo e obrigatório' }),
  split: z.boolean().default(false),
  quantitySplit: z.coerce.number().optional().default(1),
  paymentFrequency: z.coerce.number().optional(),
  fixedFrequency: z.boolean().default(false),
})

type InstallmentFormData = z.infer<typeof installmentFormSchema>

export function FormInstallments() {
  const {
    fetchInstallmentsSelects,
    installmentsData,
    typePaymentCanSplit,
    editable,
    setCanFinalize,
  } = useEmissionStore(
    ({
      fetchInstallmentsSelects,
      installmentsData,
      typePaymentCanSplit,
      editable,
      setCanFinalize,
    }) => ({
      fetchInstallmentsSelects,
      installmentsData,
      typePaymentCanSplit,
      editable,
      setCanFinalize,
    }),
  )
  const installmentForm = useForm<InstallmentFormData>({
    resolver: zodResolver(installmentFormSchema),
    defaultValues: {
      quantitySplit: 1,
    },
  })

  const {
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { isSubmitting },
  } = installmentForm

  const params = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleGenerateInstallments({
    dueDate,
    fixedFrequency,
    paymentFrequency,
    paymentType,
    quantitySplit,
    split,
  }: InstallmentFormData) {
    if (!editable) return
    if (split && !paymentFrequency) {
      setError('paymentFrequency', {
        message: 'Este campo e obrigatório',
      })
      return
    }
    const response = await api.put(
      `financial/account/finance/${params.emissionId}/installment`,
      {
        paymentTypeId: paymentType,
        split,
        quantitySplit,
        dueDate,
        fixedFrequency,
        paymentFrequency,

        application: `blank_financeiro_emissao_${params.type}`,
      },
    )

    if (response.status !== 200) return

    setCanFinalize(true)

    queryClient.refetchQueries(['finance/account/launch/installments'])

    toast({
      title: 'Parcelas geradas com sucesso!',
      variant: 'success',
    })
  }

  const { data } = useQuery<SelectData[]>({
    queryKey: ['finance/account/emission/installments/selects'],
    queryFn: () => fetchInstallmentsSelects({ type: params.type as string }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    reset({
      ...installmentsData,
      paymentType: installmentsData?.paymentType.value,
      dueDate: dayjs(installmentsData?.dueDate).format('YYYY-MM-DD'),
      split: Boolean(installmentsData?.split),
      fixedFrequency: Boolean(installmentsData?.fixedFrequency),
    })
  }, [installmentsData])

  const goInstallment = watch('split')
  const paymentType = watch('paymentType')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Bolt size={16} />
          Gerar parcelas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <FormProvider {...installmentForm}>
          <form
            onSubmit={handleSubmit(handleGenerateInstallments)}
            className="flex w-full flex-col gap-4"
          >
            <Form.Field>
              <Form.Label htmlFor="paymentType">
                Método de pagamento:
              </Form.Label>
              <Form.Select name="paymentType" id="paymentType" options={data} />
              <Form.ErrorMessage field="paymentType" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="dueDate">Data de vencimento</Form.Label>
              <Form.Input type="date" name="dueDate" id="dueDate" />
              <Form.ErrorMessage field="dueDate" />
            </Form.Field>

            <Form.Field className="flex flex-row">
              <Form.Checkbox
                disabled={!typePaymentCanSplit(paymentType)}
                name="split"
                id="split"
              />
              <Form.Label htmlFor="split">Vai parcelar?</Form.Label>
            </Form.Field>

            {goInstallment && (
              <fieldset className="flex flex-col gap-4 border-t border-zinc-300 py-4">
                <Form.Field>
                  <Form.Label htmlFor="quantitySplit">
                    Numero de parcelas:
                  </Form.Label>
                  <Form.Input
                    name="quantitySplit"
                    id="quantitySplit"
                    type="number"
                  />
                  <Form.ErrorMessage field="quantitySplit" />
                </Form.Field>

                <Form.Field>
                  <Form.Label htmlFor="paymentFrequency">
                    Intervalo de parcelas:
                  </Form.Label>
                  <Form.Input
                    name="paymentFrequency"
                    type="number"
                    id="paymentFrequency"
                  />
                  <Form.ErrorMessage field="paymentFrequency" />
                </Form.Field>

                <Form.Field className="flex flex-row">
                  <Form.Checkbox name="fixedFrequency" id="fixedFrequency" />
                  <Form.Label htmlFor="fixedFrequency">
                    Frequência fixa ?
                  </Form.Label>
                  <Form.ErrorMessage field="fixedFrequency" />
                </Form.Field>
              </fieldset>
            )}

            <Button disabled={isSubmitting || !editable}>
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

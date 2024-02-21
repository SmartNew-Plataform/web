'use client'
import { Form } from '@/components/form'
import { LoadingWithBg } from '@/components/loading-with-bg'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { currencyFormat } from '@/lib/currencyFormat'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface TaxationData {
  taxation: Array<{
    id: number
    observation: string
    taxation: string
    value: number
    type: string
  }>
  listTaxation: Array<{
    value: string
    label: string
  }>
  increase: string
  discount: string
  diference: string
}

interface TributesModal {
  splitId: number
  emissionId: number
}

const tributesFormSchema = z.object({
  type: z.string({ required_error: 'Este campo e obrigatório!' }),
  taxation: z.coerce.number({ required_error: 'Este campo e obrigatório!' }),
  value: z.coerce.number({ required_error: 'Este campo e obrigatório!' }),
  description: z.string({ required_error: 'Este campo e obrigatório!' }),
})

type TributesFormSchema = z.infer<typeof tributesFormSchema>

export function TributesModal({ splitId, emissionId }: TributesModal) {
  const [taxationInLoading, setTaxationInLoading] = useState(false)
  const tributesForm = useForm<TributesFormSchema>({
    resolver: zodResolver(tributesFormSchema),
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = tributesForm
  const { toast } = useToast()

  async function fetchData() {
    const [responseTributes, responseTaxation] = await Promise.all([
      api
        .get<{ data: TaxationData['taxation'] }>(
          `financial/account/split/${splitId}/taxation`,
        )
        .then((res) => res.data),
      api.get(`financial/account/list-taxation`).then((res) => res.data),
    ])

    const onlyPositive = responseTributes.data.filter(
      (item: { type: string }) => item.type === 'ACRESCIMO',
    )
    const onlyNegative = responseTributes.data.filter(
      (item: { type: string }) => item.type === 'DESCONTO',
    )

    const totalPositive = onlyPositive.reduce(
      (acc, { value }) => acc + value,
      0,
    )
    const totalNegative = onlyNegative.reduce(
      (acc, item) => acc + item.value,
      0,
    )

    return {
      taxation: responseTributes.data,
      listTaxation: responseTaxation.data,
      increase: currencyFormat(totalPositive),
      discount: currencyFormat(totalNegative),
      diference: currencyFormat(
        totalPositive + (totalNegative > 0 ? totalNegative - -1 : 0),
      ),
    }
  }

  const { data, isLoading, isFetching, refetch } = useQuery<TaxationData>({
    queryKey: [`financial/account/tributes/${splitId}`],
    queryFn: fetchData,
  })

  async function handleNewTribute(data: TributesFormSchema) {
    const response = await api
      .post(`financial/account/split/${splitId}/taxation`, {
        ...data,
        emissionId,
      })
      .then((res) => res.data)

    if (!response.inserted) return

    refetch()
    reset({
      description: '',
      taxation: 0,
      type: '',
      value: 0,
    })
    toast({
      title: 'Taxação inserida com sucesso!',
      variant: 'success',
    })
  }

  async function handleDeleteTaxation(id: number) {
    setTaxationInLoading(true)
    const response = await api
      .delete(`financial/account/split/${splitId}/taxation/${id}`)
      .then((res) => res.data)

    setTaxationInLoading(false)

    if (!response.deleted) return

    toast({
      title: 'Deletado com sucesso!',
      variant: 'success',
    })
    refetch()
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="icon-xs" variant="secondary">
          <SlidersHorizontal className="w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-3xl">
        <div className="flex gap-4">
          <FormProvider {...tributesForm}>
            <form
              className="flex min-w-[360px] flex-col gap-3"
              onSubmit={handleSubmit(handleNewTribute)}
            >
              <Form.Field>
                <Form.Label htmlFor="type-select">Tipo:</Form.Label>
                <Form.Select
                  name="type"
                  id="type-select"
                  options={[
                    { label: 'Acréscimos', value: 'ACRESCIMO' },
                    { label: 'Descontos', value: 'DESCONTO' },
                  ]}
                />
                <Form.ErrorMessage field="type" />
              </Form.Field>
              <Form.Field>
                <Form.Label htmlFor="taxation-select">Tributos:</Form.Label>
                <Form.Select
                  name="taxation"
                  id="taxation-select"
                  options={data?.listTaxation || []}
                />
                <Form.ErrorMessage field="taxation" />
              </Form.Field>
              <Form.Field>
                <Form.Label htmlFor="value-input">Valor:</Form.Label>
                <Form.Input type="number" name="value" id="value-input" />
                <Form.ErrorMessage field="value" />
              </Form.Field>
              <Form.Field>
                <Form.Label htmlFor="description-input">Descrição:</Form.Label>
                <Form.Textarea name="description" id="description-input" />
                <Form.ErrorMessage field="description" />
              </Form.Field>
              <Button
                loading={isSubmitting}
                disabled={isSubmitting}
                type="submit"
              >
                Enviar
              </Button>
            </form>
          </FormProvider>

          <div className="flex h-full w-full flex-1 flex-col gap-4">
            <div className="relative flex h-full flex-col gap-3 overflow-auto border-b">
              {(isLoading || isFetching || taxationInLoading) && (
                <LoadingWithBg />
              )}
              {data?.taxation.map(
                ({ taxation, value, observation, type, id }) => (
                  <div
                    key={id}
                    className="flex justify-between rounded bg-slate-200 p-3"
                  >
                    <div className="flex flex-col">
                      <strong className="text-slate-700">{type}</strong>
                      <span>{currencyFormat(value)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex gap-3">
                        <Button
                          size="icon-xs"
                          variant="destructive"
                          onClick={() => handleDeleteTaxation(id)}
                        >
                          <Trash2 width={12} />
                        </Button>
                        <strong className="text-slate-700">{taxation}</strong>
                      </div>
                      <span>{observation}</span>
                    </div>
                  </div>
                ),
              )}
            </div>
            <div className="flex w-full justify-between divide-x divide-zinc-400">
              <div className="flex flex-col items-center px-2">
                <span>Acréscimos:</span>
                <span>{data?.increase}</span>
              </div>
              <div className="flex flex-col items-center px-2">
                <span>Descontos:</span>
                <span>{data?.discount}</span>
              </div>
              <div className="flex flex-col items-center px-2">
                <span>Diferença:</span>
                <span>{data?.diference}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ApiTechnicalDetailsMapper } from '@/lib/mappers/api-technical-details-mapper'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const technicalDetailsSchema = z.object({
  maintenanceDiagnosis: z.string().optional(),
  solution: z.string().optional(),
  executorObservation: z.string().optional(),
  technicalDrive: z.string().optional(),
  technicalArrival: z.string().optional(),
  serviceEvaluationNote: z.number().optional(),
  priority: z.string().optional().nullable(),
  classification: z.string().optional().nullable(),
})

export type TechnicalDetailsFormData = z.infer<typeof technicalDetailsSchema>

export function FormTechnical() {
  const detailForm = useForm<TechnicalDetailsFormData>({
    resolver: zodResolver(technicalDetailsSchema),
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = detailForm
  const params = useParams()
  const { toast } = useToast()

  const { data, isLoading, refetch } = useQuery<TechnicalDetailsFormData>({
    queryKey: ['maintenance/order-service/details', params.serviceOrderId],
    queryFn: async () => {
      const response = await api
        .get(
          `/maintenance/service-order/${params.serviceOrderId}/technical-details`,
        )
        .then((res) => res.data)

      return response.data
    },
  })

  async function handleUpdateServiceOrder(data: TechnicalDetailsFormData) {
    const raw = ApiTechnicalDetailsMapper.toApi(data)
    const response = await api.put(
      `/maintenance/service-order/${params.serviceOrderId}/technical-details`,
      raw,
    )

    if (response.status !== 200) return

    toast({
      title: 'Ordem de serviço atualizada com sucesso!',
      variant: 'success',
    })
    refetch()
  }

  const { data: selects, isLoading: isLoadingSelects } = useQuery({
    queryKey: ['technical-details/selects'],
    queryFn: async () => {
      const [classification, priority] = await Promise.all([
        api
          .get<{
            data: SelectData[]
          }>('/system/choices/list-classification-service-order')
          .then((res) => res.data.data),
        api
          .get<{
            data: SelectData[]
          }>('/system/choices/list-priority-service-order')
          .then((res) => res.data.data),
      ])

      return { classification, priority }
    },
  })

  useEffect(() => {
    if (!data) return
    reset({
      ...data,
      technicalDrive: dayjs(data.technicalDrive).format('YYYY-MM-DD'),
      technicalArrival: dayjs(data.technicalArrival).format('YYYY-MM-DD'),
    })
    console.log(dayjs(data.technicalArrival).format('YYYY-MM-DD'))
  }, [data])

  if (isLoading || !data) {
    return (
      <Card className="w-full max-w-6xl">
        <CardContent className="grid max-h-full w-full grid-cols-auto gap-6 overflow-auto pt-6">
          {Array.from({ length: 14 }).map((_, i) => (
            <Form.SkeletonField key={i} />
          ))}
        </CardContent>
      </Card>
    )
  }

  console.log(data)

  return (
    <Card className="flex max-h-full w-full max-w-6xl flex-col overflow-auto">
      <CardContent className="max-h-full w-full pt-6">
        <FormProvider {...detailForm}>
          <form
            className="relative grid h-full grid-cols-auto gap-6 overflow-auto"
            onSubmit={handleSubmit(handleUpdateServiceOrder)}
          >
            <Form.Field>
              <Form.Label htmlFor="maintenanceDiagnosis">
                Diagnostico da manutenção:
              </Form.Label>
              <Form.Textarea
                name="maintenanceDiagnosis"
                id="maintenanceDiagnosis"
              />
              <Form.ErrorMessage field="maintenanceDiagnosis" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="solution">Solução:</Form.Label>
              <Form.Textarea name="solution" id="solution" />
              <Form.ErrorMessage field="solution" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="executorObservation">
                Observação do Executor:
              </Form.Label>
              <Form.Textarea
                name="executorObservation"
                id="executorObservation"
              />
              <Form.ErrorMessage field="executorObservation" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="technicalDrive">
                Acionamento técnico:
              </Form.Label>
              <Form.Input
                type="date"
                name="technicalDrive"
                id="technicalDrive"
              />
              <Form.ErrorMessage field="technicalDrive" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="technicalArrival">
                Chegada Técnico:
              </Form.Label>
              <Form.Input
                type="date"
                name="technicalArrival"
                id="technicalArrival"
              />
              <Form.ErrorMessage field="technicalArrival" />
            </Form.Field>

            {isLoadingSelects ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label htmlFor="priority">Prioridade:</Form.Label>
                <Form.Select
                  name="priority"
                  id="priority"
                  options={selects?.priority || []}
                />
                <Form.ErrorMessage field="priority" />
              </Form.Field>
            )}

            {isLoadingSelects ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label htmlFor="classification">Classificação:</Form.Label>
                <Form.Select
                  name="classification"
                  id="classification"
                  options={selects?.classification || []}
                />
                <Form.ErrorMessage field="classification" />
              </Form.Field>
            )}

            <Form.Field>
              <Form.Label htmlFor="serviceEvaluationNote">
                Nota de avaliação do serviço:
              </Form.Label>
              <Form.Rater name="serviceEvaluationNote" withRatingLabel />
              <Form.ErrorMessage field="serviceEvaluationNote" />
            </Form.Field>

            <Button
              className="sticky bottom-0 col-span-3"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

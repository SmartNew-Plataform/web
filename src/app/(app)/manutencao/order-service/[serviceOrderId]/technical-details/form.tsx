'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useServiceOrder } from '@/store/maintenance/service-order'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
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
  serviceEvaluationNote: z.string().optional(),
  priority: z.string().optional(),
  classification: z.string().optional(),
  cause: z.string().optional(),
  statusFail: z.string().optional(),
})

type TechnicalDetailsData = z.infer<typeof technicalDetailsSchema>

export function FormTechnical() {
  const detailForm = useForm<TechnicalDetailsData>({
    resolver: zodResolver(technicalDetailsSchema),
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = detailForm
  const { fetchSelects } = useServiceOrder()
  const params = useParams()
  const { toast } = useToast()

  const { data, isLoading, refetch } = useQuery<TechnicalDetailsData>({
    queryKey: ['maintenance/order-service/details', params.serviceOrderId],
    queryFn: async () => {
      const response = await api
        .get(`/maintenance/service-order/${params.serviceOrderId}`)
        .then((res) => res.data)

      return response.data
    },
  })

  async function handleUpdateServiceOrder(data: TechnicalDetailsData) {
    console.log(data)
    // const raw = ApiServiceOrderMapper.toApi(data)
    const response = await api.put(
      `/maintenance/service-order/${params.serviceOrderId}`,
      // raw,
    )

    if (response.status !== 200) return

    toast({
      title: 'Ordem de serviço atualizada com sucesso!',
      variant: 'success',
    })
    refetch()
  }

  useEffect(() => {
    fetchSelects()
  }, [])

  // useEffect(() => {
  //   if (!data) return
  //   reset({
  //     maintenanceDiagnosis: data.comments,
  //     solution: data.descriptionServicePerformed,
  //     executorObservation: data.observationsExecutor,
  //   })
  // }, [data])

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

            <Form.Field>
              <Form.Label htmlFor="serviceEvaluationNote">
                Nota de avaliação do serviço:
              </Form.Label>
              <Form.Select
                name="serviceEvaluationNote"
                id="serviceEvaluationNote"
                options={[]}
              />
              <Form.ErrorMessage field="serviceEvaluationNote" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="priority">Prioridade:</Form.Label>
              <Form.Select name="priority" id="priority" options={[]} />
              <Form.ErrorMessage field="priority" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="classification">Classificação:</Form.Label>
              <Form.Select
                name="classification"
                id="classification"
                options={[]}
              />
              <Form.ErrorMessage field="classification" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="cause">Causa motivo:</Form.Label>
              <Form.Select name="cause" id="cause" options={[]} />
              <Form.ErrorMessage field="cause" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="statusFail">Status falha:</Form.Label>
              <Form.Select name="statusFail" id="statusFail" options={[]} />
              <Form.ErrorMessage field="statusFail" />
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

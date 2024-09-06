'use client'

import { ServiceOrderData } from '@/@types/maintenance/service-order'
import { Form as FormComponent } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ApiServiceOrderMapper } from '@/lib/mappers/api-service-order-mapper'
import { useServiceOrder } from '@/store/maintenance/service-order'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  createServiceFormSchema,
  ServiceFormData,
} from '../../service-order-form'
import { StepOne } from '../../steps/step-one'
import { StepTwo } from '../../steps/step-two'

export function Form() {
  const detailForm = useForm<ServiceFormData>({
    resolver: zodResolver(createServiceFormSchema),
  })
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = detailForm
  const { fetchSelects } = useServiceOrder()
  const params = useParams()
  const { toast } = useToast()

  const { data, isLoading, refetch } = useQuery<ServiceOrderData>({
    queryKey: ['maintenance/order-service/details', params.serviceOrderId],
    queryFn: async () => {
      const response = await api
        .get(`/maintenance/service-order/${params.serviceOrderId}`)
        .then((res) => res.data)

      return response.data
    },
  })

  async function handleUpdateServiceOrder(data: ServiceFormData) {
    console.log(data)
    const raw = ApiServiceOrderMapper.toApi(data)
    const response = await api.put(
      `/maintenance/service-order/${params.serviceOrderId}`,
      raw,
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

  useEffect(() => {
    if (!data) return
    reset({
      requester: data.idRequester ? data.idRequester.toString() : '',
      equipment: data.equipment.id.toString(),
      branch: data.branch.id.toString(),
      hourMeter: Number(data.hourMeter),
      odometer: Number(data.odometer),
      typeMaintenance: data.typeMaintenance.id.toString(),
      executantSector: data.sectorExecutor.id.toString(),
      status: data.idStatusServiceOrder.toString(),
      requestDate: data.dateTimeRequest
        ? dayjs(data.dateTimeRequest).format('YYYY-MM-DD')
        : '',
      equipmentFail: data.descriptionRequest,
      maintainers: data.maintainers ? data.maintainers.split(',') : [],
      orderBonded: data.idServiceOrderFather
        ? data.idServiceOrderFather.toString()
        : '',
      stoppedMachine: Boolean(data.machineStop),
      stoppedDate: data.dateEquipmentStop
        ? dayjs(data.dateEquipmentStop).format('YYYY-MM-DD')
        : '',
      deadlineDate: data.dateExpectedEnd
        ? dayjs(data.dateExpectedEnd).format('YYYY-MM-DD')
        : '',
      closingDate: data.dateEnd ? dayjs(data.dateEnd).format('YYYY-MM-DD') : '',
      dueDate: data.dueDate ? dayjs(data.dueDate).format('YYYY-MM-DD') : '',
      maintenanceDiagnosis: data.comments,
      solution: data.descriptionServicePerformed,
      executorObservation: data.observationsExecutor,
    })
  }, [data])

  if (isLoading || !data) {
    return (
      <Card className="w-full max-w-6xl">
        <CardContent className="grid max-h-full w-full grid-cols-auto gap-6 overflow-auto pt-6">
          {Array.from({ length: 14 }).map((_, i) => (
            <FormComponent.SkeletonField key={i} />
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
            <StepOne />
            <StepTwo />
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

'use client'
import { Model } from '@/@types/maintenance/checklist'
import { ServiceOrderData } from '@/@types/maintenance/service-order'
import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useServiceOrderChecklist } from '@/store/maintenance/service-order-checklist'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ComponentProps, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Responses } from './responses'

const checklistFormSchema = z.object({
  equipment: z.number(),
  period: z.string().optional(),
  mileage: z.coerce.number().optional(),
  hourMeter: z.coerce.number().optional(),
  checklist: z.string({ required_error: 'Este campo e obrigatório' }),
})

type ChecklistForm = z.infer<typeof checklistFormSchema>

interface ChecklistSheetProps extends ComponentProps<typeof Sheet> {}

export function CreateChecklistSheet({
  children,
  ...props
}: ChecklistSheetProps) {
  const checklistForm = useForm<ChecklistForm>({
    resolver: zodResolver(checklistFormSchema),
  })
  const { handleSubmit, setValue, setError, reset } = checklistForm
  const params = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [checklistId, setChecklistId] = useState()
  const [tab, setTab] = useState<'details' | 'responses'>('details')
  const { sheetChecklistOpen, setSheetChecklistOpen } =
    useServiceOrderChecklist()

  const { data: details } = useQuery({
    queryKey: ['details-checklist', params.serviceOrderId],
    queryFn: async () => {
      const [detailsResponse, modelResponse, turnResponse] = await Promise.all([
        api.get<{ data: ServiceOrderData }>(
          `maintenance/service-order/${params.serviceOrderId}`,
        ),
        api.get<{ bound: Model[] }>(`smart-list/bound/`),
        api.get<{ data: SelectData[] }>(
          `/maintenance/service-order/${params.serviceOrderId}/check-list/list-turn`,
        ),
      ])

      const data = detailsResponse.data.data

      setValue('equipment', data.equipment.id)

      return {
        equipment: data.equipment,
        turn: turnResponse.data.data,
        models: modelResponse.data.bound.map(
          ({ id, description, ...rest }) => ({
            label: description,
            value: id.toString(),
            ...rest,
          }),
        ),
      }
    },
  })

  async function handleSubmitChecklist(data: ChecklistForm) {
    const equipment = details?.equipment
    console.log(data)

    if (equipment?.hasPeriod && !data.period)
      return setError('period', { message: 'Este campo e obrigatório!' })
    if (equipment?.hasMileage && !data.mileage?.toString())
      return setError('mileage', { message: 'Este campo e obrigatório!' })
    if (equipment?.hasHourMeter && !data.hourMeter?.toString())
      return setError('hourMeter', { message: 'Este campo e obrigatório!' })

    console.log(data)
    const response = await api.post(
      `maintenance/service-order/${params.serviceOrderId}/check-list`,
      {
        equipmentId: data.equipment,
        periodId: Number(data.period),
        kilometer: data.mileage,
        hourMeter: data.hourMeter,
        modelId: Number(data.checklist),
      },
    )

    if (response.status !== 201) return

    toast({
      title: 'Checklist criado com sucesso!',
      variant: 'success',
    })

    setTab('responses')
    setChecklistId(response.data.id)
    queryClient.refetchQueries(['maintenance-checklist-table'])
  }

  useEffect(() => {
    setChecklistId(undefined)
    setTab('details')
    reset({
      checklist: '',
      hourMeter: 0,
      mileage: 0,
      period: '',
    })
  }, [])

  return (
    <Sheet
      {...props}
      open={sheetChecklistOpen}
      onOpenChange={setSheetChecklistOpen}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full flex-col gap-4 overflow-hidden">
        <SheetTitle>Novo checklist</SheetTitle>

        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as 'details' | 'responses')}
          className="flex h-full flex-col"
        >
          <TabsList className="w-full">
            <TabsTrigger
              className="flex-1"
              value="details"
              disabled={!!checklistId}
            >
              Detalhes
            </TabsTrigger>
            <TabsTrigger
              className="flex-1"
              value="responses"
              disabled={!checklistId}
            >
              Respostas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <FormProvider {...checklistForm}>
              <form
                className="flex w-full flex-col gap-3"
                onSubmit={handleSubmit(handleSubmitChecklist)}
              >
                {details?.equipment ? (
                  <Form.Field>
                    <Form.Label required htmlFor="equipment">
                      Equipamento:
                    </Form.Label>
                    <Input readOnly defaultValue={details?.equipment.label} />
                    <Form.Input
                      type="hidden"
                      name="equipment"
                      value={details?.equipment.id}
                    />
                    <Form.ErrorMessage field="equipment" />
                  </Form.Field>
                ) : (
                  <Form.SkeletonField />
                )}

                {details?.equipment.hasPeriod && (
                  <Form.Field>
                    <Form.Label required htmlFor="period">
                      Turno:
                    </Form.Label>
                    <Form.Select options={details.turn} name="period" />
                    <Form.ErrorMessage field="period" />
                  </Form.Field>
                )}

                {details?.equipment.mileage && (
                  <Form.Field>
                    <Form.Label required htmlFor="mileage">
                      Quilometragem:
                    </Form.Label>
                    <Form.Input name="mileage" type="number" />
                    <Form.ErrorMessage field="mileage" />
                  </Form.Field>
                )}

                {details?.equipment.hourMeter && (
                  <Form.Field>
                    <Form.Label required htmlFor="hourMeter">
                      Horímetro:
                    </Form.Label>
                    <Form.Input name="hourMeter" type="number" />
                    <Form.ErrorMessage field="hourMeter" />
                  </Form.Field>
                )}

                <Form.Field>
                  <Form.Label required htmlFor="checklist">
                    Checklist:
                  </Form.Label>
                  <Form.Select
                    options={details?.models.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                    name="checklist"
                  />
                  <Form.ErrorMessage field="checklist" />
                </Form.Field>

                <Button>
                  <Save size={16} />
                  Salvar
                </Button>
              </form>
            </FormProvider>
          </TabsContent>

          <TabsContent
            value="responses"
            className="flex h-full w-full flex-col"
          >
            <Responses checklistId={checklistId} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

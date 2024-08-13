import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { WizardForm } from '@/components/wizard-form'
import { WizardFormStep } from '@/components/wizard-form/wizard-form-step'
import { useWizardForm } from '@/hooks/use-wizard-form'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { StepOne } from './steps/step-one'
import { StepTwo } from './steps/step-two'

interface ServiceOrderFormProps extends ComponentProps<typeof Sheet> {
  // onSubmit: (data: ActiveFormData) => Promise<void>
  // defaultValues?: ActiveFormData
  // mode: 'create' | 'edit'
  data: []
}

const createServiceFormSchema = z.object({
  requester: z.string({ required_error: 'O solicitante e obrigatório!' }),
  equipment: z.string({ required_error: 'O equipamento e obrigatório!' }),
  hourMeter: z.coerce.number({ required_error: 'O horímetro é obrigatório!' }),
  odometer: z.coerce.number({ required_error: 'O odômetro é obrigatório!' }),
  branch: z.string({ required_error: 'A filial e obrigatória!' }),
  typeMaintenance: z.string({
    required_error: 'O tipo de manutenção e obrigatório!',
  }),
  executantSector: z.string({
    required_error: 'O setor de manutenção e obrigatório!',
  }),
  status: z.string({ required_error: 'O status é obrigatório!' }),
  requestDate: z.string({
    required_error: 'A data de solicitação é obrigatório!',
  }),
  equipmentFail: z.string({ required_error: 'A observação e obrigatória!' }),

  orderBonded: z.string().optional(),
  maintainers: z.array(z.string()).optional(),
  stoppedMachine: z.boolean().optional(),
  stoppedDate: z.string().optional(),
  deadlineDate: z.string().optional(),
  closingDate: z.string().optional(),
  dueDate: z.string().optional(),
  maintenanceDiagnosis: z.string().optional(),
  solution: z.string().optional(),
  executorObservation: z.string().optional(),
})

export type ServiceFormData = z.infer<typeof createServiceFormSchema>

export function ServiceOrderForm({
  children,
  ...props
}: ServiceOrderFormProps) {
  const createServiceForm = useForm<ServiceFormData>({
    resolver: zodResolver(createServiceFormSchema),
  })
  const { handleSubmit } = createServiceForm
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const createServiceWizardForm = useWizardForm()

  const { paginate, percentSteps, lastStep, firstStep } =
    createServiceWizardForm

  function handleNextStep() {
    paginate({ newDirection: 1 })
  }

  async function handleSubmitIntermediate(data: ServiceFormData) {
    console.log(data)
    const response = await api.post('maintenance/service-order', {
      idServiceOrderFather: data.orderBonded,
      idBranch: data.branch,
      idEquipment: data.equipment,
      descriptionRequest: data.equipmentFail,
      comments: data.maintenanceDiagnosis,
      executanteObservations: data.executorObservation,
      idTypeMaintenance: data.typeMaintenance,
      statusServiceOrder: data.status,
      dateTimeRequest: data.requestDate,
      dateExpectedTerm: data.deadlineDate,
      dateEnd: data.closingDate,
      dateEquipamentoStop: data.stoppedDate,
      timeMachineStop: data.stoppedMachine,
      idRequester: data.requester,
      sectorExecutante: data.executantSector,
      maintainers: data.maintainers,
      // dateEquipmentWorked: ,
      // occurrence: string,
      // causeReason: 0,
      // statusFailure: string,
      // servicePending: string,
      // hasAttachment: string,
      // idServiceRequest: 0,
      // idProductionRegistration: 0,
      // aux: string,
    })

    if (response.status !== 201) return

    toast({
      title: 'Ordem de serviço criada com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['maintenance-service-order-table'])
  }

  return (
    <Sheet {...props}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex max-h-screen w-min flex-col overflow-x-hidden">
        <FormProvider {...createServiceForm}>
          <h2 className="mt-4 text-xl font-semibold text-slate-600">
            {firstStep ? 'Informações obrigatórias' : 'Informações adicionais'}
          </h2>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full bg-violet-500"
              animate={{ width: `${percentSteps}%` }}
            />
          </div>
          <form
            id="service-form"
            onSubmit={handleSubmit(handleSubmitIntermediate)}
            className="mt-4 flex h-full w-full flex-col gap-3 overflow-auto overflow-x-hidden"
          >
            <WizardForm {...createServiceWizardForm}>
              <WizardFormStep>
                <StepOne />
              </WizardFormStep>
              <WizardFormStep>
                <StepTwo />
              </WizardFormStep>
            </WizardForm>
          </form>
          <div className="flex w-full justify-between gap-3 bg-white pt-4">
            <Button
              type="submit"
              variant="outline"
              size="icon"
              onClick={() => paginate({ newDirection: -1 })}
              disabled={firstStep}
            >
              <ChevronLeft size={16} />
            </Button>

            <div className="flex gap-3">
              <Button type="submit" variant="success" form="service-form">
                <Save size={16} />
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={handleNextStep}
                disabled={lastStep}
                size="icon"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

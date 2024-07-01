'use client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
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
import { StepThree } from './steps/step-three'
import { StepTwo } from './steps/step-two'

const createSupplyFormSchema = z.object({
  type: z.string({ required_error: 'Este campo é obrigatório!' }),
  typeSupplier: z.string({ required_error: 'Este campo é obrigatório!' }),
  driver: z.string({ required_error: 'Este campo é obrigatório!' }),
  odometerPrevious: z.coerce.number().optional().nullable(),
  odometer: z.coerce.number({ required_error: 'Este campo é obrigatório!' }),
  request: z.string({ required_error: 'Este campo é obrigatório!' }),
  date: z.coerce.string({ required_error: 'Informe a data do abastecimento!' }),
  equipment: z.string({ required_error: 'Selecione o equipamento!' }),
  counter: z.coerce.number({ required_error: 'Este campo é obrigatório!' }),
  last: z.coerce.number({ required_error: 'Este campo é obrigatório!' }),
  fuel: z.string().optional(),
  quantity: z.coerce.number({ required_error: 'Informe a quantidade!' }),
  accomplished: z.coerce.number({ required_error: 'Informe o consumo!' }),
  value: z.coerce.number({ required_error: 'Informe o valor unitário!' }),
  compartment: z.string({ required_error: 'Este campo é obrigatório!' }),
  tank: z.string().optional(),
  train: z.string().optional(),
})

export type SupplyFormData = z.infer<typeof createSupplyFormSchema>

interface SupplyModalProps extends ComponentProps<typeof Sheet> {
  mode: 'create' | 'edit'
  defaultValues?: SupplyFormData
}

export function FuelForm({ defaultValues, mode, ...props }: SupplyModalProps) {
  const createSupplyForm = useForm<SupplyFormData>({
    resolver: zodResolver(createSupplyFormSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = createSupplyForm

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const createActiveWizardForm = useWizardForm()
  const { paginate, percentSteps, lastStep, firstStep } = createActiveWizardForm

  async function handleCreateFuelling(data: SupplyFormData) {
    const response = api.post('fuelling/', {
      ...data,
      equipmentId: data.equipment,
      type: data.type,
      fuelId: data.compartment,
      value: data.value,
    })

    if (response.status !== 201) return

    toast({
      title: 'Diverso criado com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['fuelling/data'])
  }

  function handleNextStep() {
    paginate({ newDirection: 1 })
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex max-h-screen w-1/4 flex-col overflow-x-hidden">
        <div className="mt-4 flex items-end justify-between border-b border-zinc-200 pb-4">
          <SheetTitle>Cadastrar abastecimento</SheetTitle>
        </div>
        <FormProvider {...createSupplyForm}>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full bg-violet-500"
              animate={{ width: `${percentSteps}%` }}
            />
          </div>
          <form
            id="fuellingForm"
            onSubmit={handleSubmit(handleCreateFuelling)}
            className="mt-4 flex h-full w-full flex-col gap-3 overflow-auto overflow-x-hidden"
          >
            <WizardForm {...createActiveWizardForm}>
              <WizardFormStep>
                <StepOne />
              </WizardFormStep>
              <WizardFormStep>
                <StepTwo />
              </WizardFormStep>
              <WizardFormStep>
                <StepThree />
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

            <Button
              className="w-full"
              loading={isSubmitting}
              disabled={isSubmitting}
              type="submit"
              variant="success"
              form="fuellingForm"
            >
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
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useWizardForm } from '@/hooks/use-wizard-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { WizardForm } from '@/components/wizard-form'
import { WizardFormStep } from '@/components/wizard-form/wizard-form-step'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { StepOne } from './steps/step-one'

interface ServiceOrderFormProps extends ComponentProps<typeof Sheet> {
  // onSubmit: (data: ActiveFormData) => Promise<void>
  // defaultValues?: ActiveFormData
  // mode: 'create' | 'edit'
  data: []
}

const createServiceFormSchema = z.object({
  equipment: z.string({ required_error: 'O equipamento e obrigatório!' }),
  branch: z.string({ required_error: 'A filial e obrigatória!' }),
  typeMaintenance: z.string({
    required_error: 'O tipo de manutenção e obrigatório!',
  }),
})

export type ServiceFormData = z.infer<typeof createServiceFormSchema>

export function ServiceOrderForm({ ...props }: ServiceOrderFormProps) {
  const createServiceForm = useForm<ServiceFormData>({
    resolver: zodResolver(createServiceFormSchema),
  })

  const createServiceWizardForm = useWizardForm()

  const { paginate, percentSteps, lastStep, firstStep } =
    createServiceWizardForm

  function handleNextStep() {
    paginate({ newDirection: 1 })
  }

  return (
    <Sheet {...props}>
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
            // onSubmit={handleSubmit(handleSubmitIntermediate)}
            className="mt-4 flex h-full w-full flex-col gap-3 overflow-auto overflow-x-hidden"
          >
            <WizardForm {...createServiceWizardForm}>
              <WizardFormStep>
                <StepOne />
              </WizardFormStep>
              <WizardFormStep>
                <StepOne />
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
              <Button
                loading={false}
                disabled={true}
                type="submit"
                variant="success"
                form="active-form"
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
          </div>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

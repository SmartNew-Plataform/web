'use client'
import { Active } from '@/@types/active'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { WizardForm } from '@/components/wizard-form'
import { WizardFormStep } from '@/components/wizard-form/wizard-form-step'
import { useWizardForm } from '@/hooks/use-wizard-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { StepOne } from './steps/step-one'
import { StepTwo } from './steps/step-two'

const createActiveFormSchema = z.object({
  client: z.string({ required_error: 'O cliente e obrigatório!' }),
  equipment: z.string({ required_error: 'O equipamento e obrigatório!' }),
  equipmentDad: z.string().optional(),
  patrimonyNumber: z.string().optional(),
  costCenter: z.string({ required_error: 'O centro de custo e obrigatório!' }),
  description: z.string({ required_error: 'A descrição e obrigatória!' }),
  observation: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
  dataSheet: z.string().optional(),
  family: z.string({ required_error: 'A familia e obrigatória!' }),
  equipmentType: z.string().optional(),
  manufacturer: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  fiscalNumber: z.string().optional(),
  acquisitionValue: z.number().optional(),
  manufacturingYear: z.number().optional(),
  modelYear: z.number().optional(),
  buyDate: z.date().optional(),
  guaranteeTime: z.number().optional(),
  costPerHour: z.number().optional(),
  equipmentStatus: z.string().optional(),
  consumptionType: z.string({
    required_error: 'O tipo de consumo e obrigatório!',
  }),
  consumptionFuel: z.string({
    required_error: 'O consumo de combustível e obrigatório!',
  }),
  unityMeter: z.string().optional(),
  limitUnityMeter: z.number().optional(),
  owner: z.string().optional(),
  fleet: z.string().optional(),
  chassis: z.string().optional(),
  plate: z.string().optional(),
  color: z.string().optional(),
  reindeerCode: z.string().optional(),
  CRVNumber: z.string().optional(),
  emissionDateCRV: z.date().optional(),
  licensing: z.string().optional(),
  insurancePolicy: z.string().optional(),
  insurancePolicyExpiration: z.string().optional(),
  CTFinameNumber: z.string().optional(),
  recipient: z.string().optional(),
  components: z
    .array(
      z.object({
        description: z.string({ required_error: 'A descrição e obrigatória!' }),
        image: z.array(z.instanceof(File)).optional(),
        manufacturer: z.string().optional(),
        model: z.string().optional(),
        serialNumber: z.string().optional(),
        manufacturingYear: z.number().optional(),
        status: z.string({ required_error: 'O status e obrigatório!' }),
      }),
    )
    .optional(),
})

export type ActiveFormData = z.infer<typeof createActiveFormSchema>

interface ActiveFormProps extends ComponentProps<typeof Sheet> {
  onSubmit: (data: ActiveFormData) => Promise<void>
  defaultValues?: Active
  mode: 'create' | 'edit'
}

export function ActiveForm({ onSubmit, mode, ...props }: ActiveFormProps) {
  const createActiveForm = useForm<ActiveFormData>({
    resolver: zodResolver(createActiveFormSchema),
  })

  const { handleSubmit, reset } = createActiveForm
  const createActiveWizardForm = useWizardForm()
  const { paginate, percentSteps, lastStep, firstStep } = createActiveWizardForm

  function handleNextStep() {
    paginate({ newDirection: 1 })
    // const fields = Object.keys(data)
    // console.log(fields)

    // const validation = createActiveFormSchema.safeParse(data)

    // if (validation.success) {
    //   return
    // }
    // console.log(validation.error)

    // validation.error.issues.forEach(({ path, message }) => {
    //   if (path.length > 1) {
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-expect-error
    //     setError(`${path[0]}.${path[1]}.${path[2]}`, { message })
    //     return
    //   }
    //   const field = path[0] as keyof CreateActiveFormData
    //   if (!fields.includes(field)) return
    //   setError(field, { message })
    // })

    // const hasErrorInCurrentStep = validation.error.issues.some(({ path }) => {
    //   const field = path[0] as keyof CreateActiveFormData
    //   return fields.includes(field)
    // })

    // console.log(hasErrorInCurrentStep)

    // if (!hasErrorInCurrentStep && !lastStep) paginate({ newDirection: 1 })
  }

  async function handleSubmitIntermediate(data: ActiveFormData) {
    await onSubmit(data)
    if (mode !== 'create') return
    reset()
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex max-h-screen w-min flex-col overflow-x-hidden">
        <FormProvider {...createActiveForm}>
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
            id="active-form"
            onSubmit={handleSubmit(handleSubmitIntermediate)}
            className="mt-4 flex h-full w-full flex-col gap-3 overflow-auto overflow-x-hidden"
          >
            <WizardForm {...createActiveWizardForm}>
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
              <Button type="submit" variant="success" form="active-form">
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

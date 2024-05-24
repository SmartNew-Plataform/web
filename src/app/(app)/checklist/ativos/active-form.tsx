'use client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { WizardForm } from '@/components/wizard-form'
import { WizardFormStep } from '@/components/wizard-form/wizard-form-step'
import { useWizardForm } from '@/hooks/use-wizard-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { StepOne } from './steps/step-one'
import { StepSeven } from './steps/step-seven'
import { StepTwo } from './steps/step-two'

const createActiveFormSchema = z.object({
  client: z.string({ required_error: 'O cliente e obrigatório!' }),
  equipment: z.string({ required_error: 'O equipamento e obrigatório!' }),
  equipmentDad: z.string().optional().nullable(),
  patrimonyNumber: z.string().optional().nullable(),
  costCenter: z.string().optional().nullable(),
  description: z.string({ required_error: 'A descrição e obrigatória!' }),
  observation: z.string().optional().nullable(),
  images: z.array(z.instanceof(File)).optional().nullable(),
  dataSheet: z.string().optional().nullable(),
  family: z.string({ required_error: 'A familia e obrigatória!' }),
  equipmentType: z.string().optional().nullable(),
  manufacturer: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  fiscalNumber: z.string().optional().nullable(),
  acquisitionValue: z.coerce.number().optional().nullable(),
  manufacturingYear: z.coerce.number().optional().nullable(),
  modelYear: z.coerce.number().optional().nullable(),
  buyDate: z.coerce.date().optional().nullable(),
  guaranteeTime: z.coerce.number().optional().nullable(),
  costPerHour: z.coerce.number().optional().nullable(),
  equipmentStatus: z.string().optional().nullable(),
  consumptionType: z.string().optional().nullable(),
  consumptionFuel: z.string().optional().nullable(),
  unityMeter: z.string().optional().nullable(),
  limitUnityMeter: z.coerce.number().optional().nullable(),
  owner: z.string().optional().nullable(),
  fleet: z.string().optional().nullable(),
  chassis: z.string().optional().nullable(),
  plate: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  reindeerCode: z.string().optional().nullable(),
  CRVNumber: z.string().optional().nullable(),
  emissionDateCRV: z.coerce.date().optional().nullable(),
  licensing: z.string().optional().nullable(),
  insurancePolicy: z.string().optional().nullable(),
  insurancePolicyExpiration: z.string().optional().nullable(),
  CTFinameNumber: z.string().optional().nullable(),
  recipient: z.string().optional().nullable(),
  components: z
    .array(
      z.object({
        id: z.number().optional().nullable(),
        description: z.string({ required_error: 'A descrição e obrigatória!' }),
        image: z.array(z.instanceof(File)).optional().nullable(),
        manufacturer: z.string().optional().nullable(),
        model: z.string().optional().nullable(),
        serialNumber: z.string().optional().nullable(),
        manufacturingYear: z.coerce.number().optional().nullable(),
        status: z.string({ required_error: 'O status e obrigatório!' }),
      }),
    )
    .optional()
    .nullable(),
})

export type ActiveFormData = z.infer<typeof createActiveFormSchema>

interface ActiveFormProps extends ComponentProps<typeof Sheet> {
  onSubmit: (data: ActiveFormData) => Promise<void>
  defaultValues?: ActiveFormData
  mode: 'create' | 'edit'
}

export function ActiveForm({
  onSubmit,
  mode,
  defaultValues,
  ...props
}: ActiveFormProps) {
  const createActiveForm = useForm<ActiveFormData>({
    resolver: zodResolver(createActiveFormSchema),
  })

  const {
    handleSubmit,
    reset,
    resetField,
    formState: { isSubmitting },
  } = createActiveForm
  const createActiveWizardForm = useWizardForm()
  const { paginate, percentSteps, lastStep, firstStep } = createActiveWizardForm

  useEffect(() => {
    if (!defaultValues) return
    reset(defaultValues)
  }, [defaultValues, reset])

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
    if (mode !== 'create') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      resetField('components', [])
      return
    }
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
              <WizardFormStep>
                <StepSeven />
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
                loading={isSubmitting}
                disabled={isSubmitting}
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

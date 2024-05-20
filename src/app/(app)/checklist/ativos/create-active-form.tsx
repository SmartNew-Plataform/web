'use client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { WizardForm } from '@/components/wizard-form'
import { WizardFormStep } from '@/components/wizard-form/wizard-form-step'
import { useWizardForm } from '@/hooks/use-wizard-form'
import { api } from '@/lib/api'
import { motion } from 'framer-motion'
import { ChevronRightCircle, Plus, Save, Undo2 } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { StepFive } from './steps/step-five'
import { StepFour } from './steps/step-four'
import { StepOne } from './steps/step-one'
import { StepSeven } from './steps/step-seven'
import { StepSix } from './steps/step-six'
import { StepThree } from './steps/step-three'
import { StepTwo } from './steps/step-two'

const createActiveFormSchema = z.object({
  client: z.string({ required_error: 'O cliente e obrigatório!' }),
  equipment: z.string({ required_error: 'O equipamento e obrigatório!' }),
  equipmentDad: z.string().optional(),
  patrimonyNumber: z.string().optional(),
  costCenter: z.string().optional(),
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
  consumptionType: z.string().optional(),
  consumptionFuel: z.string().optional(),
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
  components: z.array(
    z.object({
      description: z.string({ required_error: 'A descrição e obrigatória!' }),
      image: z.array(z.instanceof(File)).optional(),
      manufacturer: z.string().optional(),
      model: z.string().optional(),
      serialNumber: z.string().optional(),
      manufacturingYear: z.number().optional(),
      status: z.string({ required_error: 'O status e obrigatório!' }),
    }),
    { required_error: 'Insira no mínimo 1 componente!' },
  ),
})

type CreateActiveFormData = z.infer<typeof createActiveFormSchema>

export function CreateActiveForm() {
  const createActiveForm = useForm<CreateActiveFormData>({
    criteriaMode: 'firstError',
  })

  const { handleSubmit, setError } = createActiveForm
  const createActiveWizardForm = useWizardForm()
  const { paginate, percentSteps, lastStep, firstStep } = createActiveWizardForm

  function handleNextStep(data: CreateActiveFormData) {
    const fields = Object.keys(data)
    console.log(fields)

    const validation = createActiveFormSchema.safeParse(data)

    if (validation.success) {
      return
    }
    console.log(validation.error)

    validation.error.issues.forEach(({ path, message }) => {
      if (path.length > 1) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setError(`${path[0]}.${path[1]}.${path[2]}`, { message })
        return
      }
      const field = path[0] as keyof CreateActiveFormData
      if (!fields.includes(field)) return
      setError(field, { message })
    })

    const hasErrorInCurrentStep = validation.error.issues.some(({ path }) => {
      const field = path[0] as keyof CreateActiveFormData
      return fields.includes(field)
    })

    console.log(hasErrorInCurrentStep)

    if (!hasErrorInCurrentStep && !lastStep) paginate({ newDirection: 1 })
  }

  async function handleCreateActive(data: CreateActiveFormData) {
    handleNextStep(data)
    if (!lastStep) return

    console.log(data)
    const response = await api
      .post('system/equipment', data)
      .then((res) => res.data)
    console.log(response)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus size={16} />
          Ativo
        </Button>
      </SheetTrigger>
      <SheetContent className="flex max-h-screen w-min flex-col overflow-x-hidden">
        <FormProvider {...createActiveForm}>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full bg-violet-500"
              animate={{ width: `${percentSteps}%` }}
            />
          </div>
          <form
            id="active-form"
            onSubmit={handleSubmit(handleCreateActive)}
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
              <WizardFormStep>
                <StepFour />
              </WizardFormStep>
              <WizardFormStep>
                <StepFive />
              </WizardFormStep>
              <WizardFormStep>
                <StepSix />
              </WizardFormStep>
              <WizardFormStep>
                <StepSeven />
              </WizardFormStep>
            </WizardForm>
          </form>
          <div className="flex w-full flex-col gap-3 bg-white pt-4">
            <div className="flex justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => paginate({ newDirection: -1 })}
                disabled={firstStep}
              >
                <Undo2 size={16} />
                Voltar
              </Button>

              <Button type="submit" variant="success" form="active-form">
                {lastStep ? (
                  <>
                    <Save size={16} />
                    Salvar
                  </>
                ) : (
                  <>
                    Proximo
                    <ChevronRightCircle size={16} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

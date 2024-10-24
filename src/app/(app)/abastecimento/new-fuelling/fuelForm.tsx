'use client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { WizardForm } from '@/components/wizard-form'
import { WizardFormStep } from '@/components/wizard-form/wizard-form-step'
import { useWizardForm } from '@/hooks/use-wizard-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { StepOne } from './steps/step-one'
import { StepThree } from './steps/step-three'
import { StepTwo } from './steps/step-two'

const createSupplyFormSchema = z.object({
  type: z.string({ required_error: 'Este campo é obrigatório!' }),
  typeSupplier: z.string({ required_error: 'Este campo é obrigatório!' }),
  typeEquipment: z.string().optional(),
  driver: z.string({ required_error: 'Este campo é obrigatório!' }),
  odometerPrevious: z.coerce.number().optional(),
  odometer: z.coerce
    .number({ required_error: 'Este campo é obrigatório!' })
    .optional(),
  receipt: z.coerce
    .string({ required_error: 'Este campo é obrigatório!' })
    .optional(),
  request: z.string({ required_error: 'Este campo é obrigatório!' }).optional(),
  date: z.coerce.string({ required_error: 'Informe a data do abastecimento!' }),
  equipment: z.string({ required_error: 'Selecione o equipamento!' }),
  counter: z.coerce.number({ required_error: 'Este campo é obrigatório!' }),
  last: z.coerce.number({ required_error: 'Este campo é obrigatório!' }),
  fuel: z.string({ required_error: 'Selecione o combustível' }).optional(),
  quantity: z.coerce.number({ required_error: 'Informe a quantidade!' }),
  consumption: z.coerce.number(),
  value: z.coerce.number({ required_error: 'Informe o valor unitário!' }),
  compartment: z
    .string({ required_error: 'Este campo é obrigatório!' })
    .optional(),
  tank: z.string().optional(),
  train: z.string().optional(),
  post: z.string().optional(),
  supplier: z.string().optional(),
  comments: z.string().optional(),
})

export type SupplyFormData = z.infer<typeof createSupplyFormSchema>

export interface SupplyModalProps extends ComponentProps<typeof Sheet> {
  onSubmit: (data: SupplyFormData) => Promise<AxiosResponse>
  defaultValues?: SupplyFormData
  mode: 'create' | 'edit'
}

export function FuelForm({
  onSubmit,
  mode,
  defaultValues,
  ...props
}: SupplyModalProps) {
  const createSupplyForm = useForm<SupplyFormData>({
    resolver: zodResolver(createSupplyFormSchema),
  })

  const queryClient = useQueryClient()
  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isValid, isDirty },
  } = createSupplyForm
  const createActiveWizardForm = useWizardForm()
  const { paginate, percentSteps, lastStep, firstStep, setStep } =
    createActiveWizardForm

  function handleNextStep() {
    paginate({ newDirection: 1 })
  }

  async function handleSubmitIntermediate(data: SupplyFormData) {
    if (data.type === 'EXTERNO') {
      let hasError = false
      if (!data.receipt) {
        setError('receipt', { message: 'Este campo é obrigatório' })
        hasError = true
      }
      if (!data.request) {
        setError('request', { message: 'Este campo é obrigatório' })
        hasError = true
      }
      if (hasError) {
        return
      }
    }

    try {
      const response = await onSubmit(data)
      queryClient.refetchQueries(['fuelling/data'])
      queryClient.refetchQueries(['fuelling/list-fuel'])
      if (response.status === 201) {
        reset()
        paginate({ newDirection: -1 })
        paginate({ newDirection: -1 })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (defaultValues) {
      setStep(['step-1', 0])
      reset(defaultValues)
    }
  }, [defaultValues])

  return (
    <Sheet {...props}>
      <SheetContent className="flex max-h-screen w-1/4 flex-col overflow-x-hidden">
        <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
          <SheetTitle>
            {mode === 'edit'
              ? 'Editar abastecimento'
              : 'Cadastrar abastecimento'}
          </SheetTitle>{' '}
        </div>
        <FormProvider {...createSupplyForm}>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full bg-violet-500"
              animate={{ width: `${percentSteps}%` }}
            />
          </div>
          <p>Preencha todos os campos obrigatórios*</p>

          <form
            id="fuellingForm"
            onSubmit={handleSubmit(handleSubmitIntermediate)}
            className="mt-4 flex h-full w-full flex-col gap-3 overflow-auto overflow-x-hidden"
          >
            <WizardForm {...createActiveWizardForm}>
              <WizardFormStep className="w-full">
                <StepOne isEdit={mode === 'edit'} />
              </WizardFormStep>
              <WizardFormStep className="w-full">
                <StepTwo isEdit={mode === 'edit'} />
              </WizardFormStep>
              <WizardFormStep className="w-full">
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
              disabled={isSubmitting || !isDirty || !isValid}
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

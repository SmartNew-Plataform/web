'use client'
import { FuellingType } from '@/@types/fuelling-fuelling'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { WizardForm } from '@/components/wizard-form'
import { WizardFormStep } from '@/components/wizard-form/wizard-form-step'
import { useWizardForm } from '@/hooks/use-wizard-form'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { StepTwo } from './steps/FormInternal'
import { StepOne } from './steps/step-one'
import { StepThree } from './steps/step-three'

const createSupplyFormSchema = z.object({
  mode: z.string({ required_error: 'Este campo é obrigatório!' }),
  typeSupplier: z.string({ required_error: 'Este campo é obrigatório!' }),
  drive: z.string({ required_error: 'Este campo é obrigatório!' }),
  receipt: z.string({ required_error: 'Este campo é obrigatório!' }),
  request: z.string({ required_error: 'Este campo é obrigatório!' }),
  date: z.coerce.string({ required_error: 'Informe a data do abastecimento!' }),
  equipment: z.string({ required_error: 'Selecione o equipamento!' }),
  counter: z.coerce.number({ required_error: 'Este campo é obrigatório!' }),
  previous: z.coerce.number({ required_error: 'Este campo é obrigatório!' }),
  fuel: z.string({ required_error: 'Informe o combustível!' }),
  quantity: z.coerce.number({ required_error: 'Informe a quantidade!' }),
  accomplished: z.coerce.number({ required_error: 'Informe o consumo!' }),
  unitary: z.coerce.number({ required_error: 'Informe o valor unitário!' }),
  total: z.coerce.number({ required_error: 'Informe o custo total!' }),
  compartment: z.string({ required_error: 'Este campo é obrigatório!' }),
  tank: z.string().optional(),
  train: z.string().optional(),
})

export type SupplyFormData = z.infer<typeof createSupplyFormSchema>

interface SupplyModalProps extends ComponentProps<typeof Sheet> {
  mode: 'create' | 'edit'
  defaultValues?: FuellingType
}

export function FuelForm({ mode, ...props }: SupplyModalProps) {
  const createSupplyForm = useForm<SupplyFormData>({
    resolver: zodResolver(createSupplyFormSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = createSupplyForm

  const queryClient = useQueryClient()
  const createActiveWizardForm = useWizardForm()
  const { paginate, lastStep, firstStep } = createActiveWizardForm

  async function handleCreateFuelling({
    drive,
    post,
    receipt,
    request,
    date,
    equipment,
    fuel,
  }: SupplyFormData) {
    const response = await api.post('fuelling/post', {
      driver: drive,
      fuelStation: post,
      fiscalNumber: receipt,
      requestNumber: request,
      date,
      equipment,
      tankFuelling: fuel,
    })

    if (response.status !== 201) return

    toast({ title: 'Abastecimento criado com sucesso', variant: 'success' })

    queryClient.refetchQueries(['fuelling/new-fuelling'])
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

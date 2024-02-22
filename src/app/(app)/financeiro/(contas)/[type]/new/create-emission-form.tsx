'use client'
import { Button } from '@/components/ui/button'
import { WizardForm } from '@/components/wizard-form'
import { AnimatedContainer } from '@/components/wizard-form/animated-container'
import { useWizardForm } from '@/hooks/use-wizard-form'
import { ChevronLeft } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'

export function CreateEmissionForm() {
  const createEmissionForm = useForm()
  const wizardFormConfig = useWizardForm()
  const { paginate, lastStep, firstStep } = wizardFormConfig

  return (
    <FormProvider {...createEmissionForm}>
      <form className="mx-auto flex h-full w-96 flex-col py-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <ChevronLeft size={16} />
          </Button>
          <h2 className="text-xl font-bold text-zinc-700">
            Criar nova emissão
          </h2>
        </div>

        <WizardForm {...wizardFormConfig}>
          <AnimatedContainer>teste1</AnimatedContainer>
          <AnimatedContainer>teste2</AnimatedContainer>
          <AnimatedContainer>teste3</AnimatedContainer>
          <AnimatedContainer>teste4</AnimatedContainer>
        </WizardForm>

        <div className="flex w-full justify-end gap-4">
          {!firstStep && (
            <Button
              onClick={() => paginate({ newDirection: -1 })}
              type="button"
              variant="outline"
            >
              Voltar
            </Button>
          )}

          {lastStep ? (
            <Button type="button" onClick={() => paginate({ newDirection: 1 })}>
              Criar
            </Button>
          ) : (
            <Button type="button" onClick={() => paginate({ newDirection: 1 })}>
              Continuar
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}

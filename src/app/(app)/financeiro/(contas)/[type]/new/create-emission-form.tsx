'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { WizardForm } from '@/components/wizard-form'
import { WizardFormStep } from '@/components/wizard-form/wizard-form-step'
import { useWizardForm } from '@/hooks/use-wizard-form'
import { ArrowRight, Check, ChevronLeft, CornerDownLeft } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { motion } from 'framer-motion'

export function CreateEmissionForm() {
  const createEmissionForm = useForm()
  const { handleSubmit } = createEmissionForm
  const wizardFormConfig = useWizardForm()
  const { paginate, lastStep, firstStep, percentSteps } = wizardFormConfig

  async function handleNewEmission(data: any) {
    console.log(data)
  }

  return (
    <FormProvider {...createEmissionForm}>
      <form className="mx-auto flex h-full w-96 flex-col py-4" onSubmit={handleSubmit(handleNewEmission)}>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="icon">
            <ChevronLeft size={16} />
          </Button>
          <h2 className="text-xl font-bold text-zinc-700">
            Criar nova emissão
          </h2>
        </div>

        <WizardForm {...wizardFormConfig}>
          <WizardFormStep>
            <Form.Field>
              <Form.Label>N° Processo:</Form.Label>
              <Form.Input type='number' disabled name='processNumber' placeholder='O numero de processo e gerado automaticamente' />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="document-type-input">Tipo de documento:</Form.Label>
              <Form.Select name='documentType' id="document-type-input" options={[{ label: '', value: ''}]}/>
              <Form.ErrorMessage field='documentType' />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="document-number-input">N° Documento:</Form.Label>
              <Form.Input name='documentNumber' id="document-number-input" />
              <Form.ErrorMessage field='documentNumber' />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="sender-input">Identificação do emitente:</Form.Label>
              <Form.Select name='sender' id="sender-input" options={[{ label: '', value: ''}]}/>
              <Form.ErrorMessage field='sender' />
            </Form.Field>
          </WizardFormStep>

          <WizardFormStep>
            <Form.Field>
              <Form.Label htmlFor="issuer-input">Destinatário/Remetente:</Form.Label>
              <Form.Select name='issuer' id="issuer-input" options={[{ label: '', value: ''}]}/>
              <Form.ErrorMessage field='issuer' />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="emission-date-input">Data de emissão:</Form.Label>
              <Form.Input type='date' name='emissionDate' id="emission-date-input" />
              <Form.ErrorMessage field='emissionDate' />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="launch-date-input">Data de laçamento:</Form.Label>
              <Form.Input type='date' name='launchDate' id="launch-date-input" />
              <Form.ErrorMessage field='launchDate' />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="access-key-input">Chave de acesso:</Form.Label>
              <Form.Input type='date' name='accessKey' id="access-key-input" />
              <Form.ErrorMessage field='accessKey' />
            </Form.Field>
          </WizardFormStep>

          <WizardFormStep>
            <Form.Field>
              <Form.Label htmlFor="observation-input">Obervação:</Form.Label>
              <Form.Textarea name='observation' id="observation-input" />
              <Form.ErrorMessage field='observation' />
            </Form.Field>
          </WizardFormStep>
        </WizardForm>

        <div className="flex w-full justify-end gap-4 border-t border-zinc-300 py-4">
          {!firstStep && (
            <Button
              onClick={() => paginate({ newDirection: -1 })}
              type="button"
              variant="outline"
            >
              <CornerDownLeft size={16} />
              Voltar
            </Button>
          )}

          {lastStep ? (
            <Button type="submit">
              <Check size={16} />
              Criar
            </Button>
          ) : (
            <Button type="button" onClick={() => paginate({ newDirection: 1 })}>
              Continuar
              <ArrowRight size={16} />
            </Button>
          )}
        </div>

        <div className='w-full bg-zinc-200 rounded-full h-2 overflow-hidden'>
          <motion.div
            animate={{ width: `${percentSteps}%` }}
            className='bg-violet-500 h-2'
            transition={{ duration: 0.4 }}
          />
        </div>

      </form>
    </FormProvider>
  )
}

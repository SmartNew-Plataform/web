'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Save } from 'lucide-react'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

type EditEmissionModalProps = object & ComponentProps<typeof Dialog>

export function EditEmissionModal({ ...props }: EditEmissionModalProps) {
  const editEmissionForm = useForm()
  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...editEmissionForm}>
          <form className="flex flex-col gap-3">
            <Form.Field>
              <Form.Label htmlFor="observation-input">Obervação:</Form.Label>
              <Form.Textarea id="observation-input" name="observation" />
              <Form.ErrorMessage field="observation" />
            </Form.Field>

            <Button>
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const categoryFormSchema = z.object({
  description: z.string({ required_error: 'Este campo é obrigatório!' }),
})

export type CategoryFormData = z.infer<typeof categoryFormSchema>

interface ModalCategoryFormProps extends ComponentProps<typeof Dialog> {
  onSubmit: (data: CategoryFormData) => void
  defaultValues?: CategoryFormData
  mode?: 'create' | 'edit'
}

export function ModalCategoryForm({
  onSubmit,
  mode = 'create',
  defaultValues,
  ...props
}: ModalCategoryFormProps) {
  const categoryDiverseForm = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
  })
  const { handleSubmit, reset } = categoryDiverseForm

  async function intermadeSubmit(data: CategoryFormData) {
    await onSubmit(data)
    if (mode === 'create') reset({ description: '' })
  }

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...categoryDiverseForm}>
          <form
            onSubmit={handleSubmit(intermadeSubmit)}
            className="flex w-full flex-col gap-2"
          >
            <Form.Field>
              <Form.Label htmlFor="description-input">Descrição:</Form.Label>
              <Form.Input name="description" id="description-input" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Button type="submit">
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

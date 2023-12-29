'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const formCategoryItemSchema = z.object({
  name: z.string({ required_error: 'Esta campo e obrigatório!' }),
})

export type FormCategoryItemData = z.infer<typeof formCategoryItemSchema>

interface FormCategoryItemProps {
  handleSubmitForm: (data: FormCategoryItemData) => Promise<void>
  defaultValues?: FormCategoryItemData
}

export function FormCategoryItem({
  handleSubmitForm,
  defaultValues,
}: FormCategoryItemProps) {
  const formCategoryItem = useForm<FormCategoryItemData>({
    resolver: zodResolver(formCategoryItemSchema),
    defaultValues,
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formCategoryItem
  return (
    <FormProvider {...formCategoryItem}>
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <Form.Field>
          <Form.Label htmlFor="name">Nome:</Form.Label>
          <Form.Input name="name" id="name" />
          <Form.ErrorMessage field="name" />
        </Form.Field>

        <Button loading={isSubmitting} disabled={isSubmitting} type="submit">
          <Save className="h-3 w-3" />
          Salvar
        </Button>
      </form>
    </FormProvider>
  )
}

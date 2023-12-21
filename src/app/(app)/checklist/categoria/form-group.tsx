import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const groupFormSchema = z.object({
  branch: z.string({ required_error: 'Escolha uma filial!' }),
  name: z.string({ required_error: 'O titulo e obrigatório!' }),
})

export type GroupFormData = z.infer<typeof groupFormSchema>
type BranchData = { value: string; label: string }

interface FormGroupProps {
  mode: 'edit' | 'create'
  defaultValues?: GroupFormData
  handleSubmitFormGroup: (data: GroupFormData) => Promise<void>
}

export function FormGroup({
  mode,
  defaultValues,
  handleSubmitFormGroup,
}: FormGroupProps) {
  const groupForm = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues,
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = groupForm

  async function fetchBranches() {
    const branches: { id: number; name: string }[] = await api
      .get('/smart-list/diverse/list-branches')
      .then((res) => res.data)

    return branches.map((branch) => ({
      label: branch.name,
      value: String(branch.id),
    }))
  }

  const { data, isLoading } = useQuery<BranchData[]>(
    ['diverse:branch'],
    fetchBranches,
  )
  return (
    <FormProvider {...groupForm}>
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(handleSubmitFormGroup)}
      >
        {isLoading ? (
          <Form.SkeletonField />
        ) : (
          <Form.Field>
            <Form.Label htmlFor="branch">Filial:</Form.Label>
            <Form.Select
              disabled={mode === 'edit'}
              options={data || []}
              name="branch"
              id="branch"
            />
            <Form.ErrorMessage field="branch" />
          </Form.Field>
        )}
        <Form.Field>
          <Form.Label htmlFor="name">Titulo:</Form.Label>
          <Form.Input name="name" id="name" />
          <Form.ErrorMessage field="name" />
        </Form.Field>

        <Button loading={isSubmitting} disabled={isSubmitting}>
          Salvar
        </Button>
      </form>
    </FormProvider>
  )
}

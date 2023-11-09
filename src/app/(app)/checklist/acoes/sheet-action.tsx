'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useActionsStore } from '@/store/smartlist/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const actionFormSchema = z.object({
  description: z
    .string({ required_error: 'Este campo e obrigatório!' })
    .nonempty({ message: 'O campo não pode estar vazio!' }),
  responsible: z.string({ required_error: 'Este campo e obrigatório' }),
  deadline: z.date({ required_error: 'Este campo e obrigatório!' }),
  doneAt: z.date({ required_error: 'Este campo e obrigatório!' }),
  attach: z.instanceof(File).array(),
})

type ActionFormType = z.infer<typeof actionFormSchema>

type SheetActionProps = ComponentProps<typeof Sheet>

export function SheetAction(props: SheetActionProps) {
  const actionForm = useForm<ActionFormType>({
    resolver: zodResolver(actionFormSchema),
  })
  const { handleSubmit } = actionForm
  const { responsible } = useActionsStore(({ responsible }) => {
    return {
      responsible: responsible?.map(({ login, name }) => ({
        value: login,
        label: name,
      })),
    }
  })

  async function handleCreateAction(data: ActionFormType) {
    console.log(data)
  }

  return (
    <Sheet {...props}>
      <SheetContent className="max-w-md overflow-auto">
        <FormProvider {...actionForm}>
          <form
            className="flex w-full flex-col gap-3"
            onSubmit={handleSubmit(handleCreateAction)}
          >
            <Form.Field>
              <Form.Label htmlFor="description">Ação:</Form.Label>
              <Form.Textarea id="description" name="description" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="responsible">Responsável:</Form.Label>
              <Form.Select
                options={responsible || []}
                id="responsible"
                name="responsible"
              />
              <Form.ErrorMessage field="responsible" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="deadline">Prazo:</Form.Label>
              <Form.DatePicker id="deadline" name="deadline" />
              <Form.ErrorMessage field="deadline" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="doneAt">Data Conclusão:</Form.Label>
              <Form.DatePicker id="doneAt" name="doneAt" />
              <Form.ErrorMessage field="doneAt" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="attach">Anexo:</Form.Label>
              <Form.ImagePicker id="attach" name="attach" />
              <Form.ErrorMessage field="attach" />
            </Form.Field>

            <Button>
              <Save className="h-4 w-4" />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

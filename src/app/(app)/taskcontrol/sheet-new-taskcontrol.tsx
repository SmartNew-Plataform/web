import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { taskcontrolApi } from '@/lib/taskcontrol-api'
import { useUserStore } from '@/store/user-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const newTaskSchema = z.object({
  branch: z.string({ required_error: 'A filial e obrigatória!' }),
  description: z
    .string({ required_error: 'O titulo e obrigatório' })
    .nonempty({ message: 'Escreva um titulo pra sua nova task!' }),
})

type NewTaskData = z.infer<typeof newTaskSchema>

export function SheetNewTaskControl() {
  const { branches } = useUserStore(({ branches }) => {
    return {
      branches: branches?.map(({ id, branchNumber }) => ({
        label: branchNumber,
        value: id.toString(),
      })),
    }
  })
  const newTaskForm = useForm<NewTaskData>({
    resolver: zodResolver(newTaskSchema),
  })
  const { handleSubmit } = newTaskForm

  async function handleCreateTask(data: NewTaskData) {
    const response = await taskcontrolApi
      .post('/task', {
        description: data.description,
        branchId: Number(data.branch),
        subtasks: [],
      })
      .then((res) => res.data)

    console.log(response)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus />
          Criar nova task
        </Button>
      </SheetTrigger>

      <SheetContent className="max-h-full max-w-md">
        <SheetTitle>Criar novo Checklist</SheetTitle>

        <FormProvider {...newTaskForm}>
          <form
            className="mt-4 flex h-full w-full flex-col gap-3"
            onSubmit={handleSubmit(handleCreateTask)}
          >
            <Form.Field>
              <Form.Label>Titulo:</Form.Label>
              <Form.Input name="description" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Filial:</Form.Label>
              <Form.Select name="branch" options={branches || []} />
              <Form.ErrorMessage field="branch" />
            </Form.Field>

            <Button>
              <Plus className="h-4 w-4" />
              Criar task
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Plus } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'

export function SheetNewTaskControl() {
  const newTaskForm = useForm()
  const { handleSubmit } = newTaskForm

  async function handleCreateTask(data: any) {
    console.log(data)
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
              <Form.Input name="title" />
              <Form.ErrorMessage field="title" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Filial:</Form.Label>
              <Form.Select
                name="branch"
                options={[{ label: 'INDIRA', value: '1' }]}
              />
              <Form.ErrorMessage field="branch" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Categoria:</Form.Label>
              <Form.Select
                name="category"
                options={[{ label: 'INDIRA', value: '1' }]}
              />
              <Form.ErrorMessage field="category" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Observação:</Form.Label>
              <Form.Textarea name="observation" />
              <Form.ErrorMessage field="observation" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Anexo:</Form.Label>
              <Form.ImagePicker name="attach" />
              <Form.ErrorMessage field="attach" />
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

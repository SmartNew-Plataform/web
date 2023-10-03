import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ClipboardList, Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'

export function SheetEditTask() {
  const params = useParams()
  const editTaskForm = useForm()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <ClipboardList className="h-4 w-4" />
          Editar checklist
        </Button>
      </SheetTrigger>

      <SheetContent className="max-w-md">
        <SheetTitle>Editar Task</SheetTitle>

        <FormProvider {...editTaskForm}>
          <form className="mt-4 flex flex-col gap-3">
            <Form.Field>
              <Form.Label>Titulo:</Form.Label>
              <Form.Input name="title" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Cliente:</Form.Label>
              <Form.Select
                name="client"
                options={[{ label: 'test', value: '1' }]}
              />
            </Form.Field>

            <Form.Field>
              <Form.Label>Status:</Form.Label>
              <Form.Select
                name="status"
                options={[{ label: 'test', value: '1' }]}
              />
            </Form.Field>

            <Form.Field>
              <Form.Label>Subgrupo:</Form.Label>
              <Form.Select
                name="subgroup"
                options={[{ label: 'test', value: '1' }]}
              />
            </Form.Field>

            <Button>
              <Save className="h-4 w-4" />
              Salvar task
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

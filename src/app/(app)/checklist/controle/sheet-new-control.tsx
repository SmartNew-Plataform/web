'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const newControlSchema = z.object({})

type NewControlSchemaData = z.infer<typeof newControlSchema>

export function SheetNewControl() {
  const newControlForm = useForm({
    resolver: zodResolver(newControlSchema),
  })
  const { handleSubmit } = newControlForm

  async function handleCreateControl(data: NewControlSchemaData) {
    console.log(data)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Novo controle
        </Button>
      </SheetTrigger>

      <SheetContent className="max-h-screen max-w-md">
        <SheetTitle>Criar controle</SheetTitle>

        <FormProvider {...newControlForm}>
          <form
            onSubmit={handleSubmit(handleCreateControl)}
            className="flex h-full flex-col gap-3"
          >
            <Form.Field>
              <Form.Label>Descrição:</Form.Label>
              <Form.Input name="description" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Cor:</Form.Label>
              <Form.ColorPicker name="color" />
              <Form.ErrorMessage field="color" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Tipo:</Form.Label>
              <Form.Select
                name="type"
                options={[{ label: 'STATUS', value: '1' }]}
              />
              <Form.ErrorMessage field="type" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Ícone:</Form.Label>
              <Form.IconPicker name="icon" />
              <Form.ErrorMessage field="icon" />
            </Form.Field>

            <Button>
              <Plus className="h-4 w-4" />
              Criar checklist
            </Button>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

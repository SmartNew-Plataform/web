'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Plus } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamicNext from 'next/dynamic'
import { FormProvider, useForm } from 'react-hook-form'

export function SheetNewControl() {
  const newControlForm = useForm()
  const { handleSubmit } = newControlForm
  const icons = Object.keys(dynamicIconImports)

  async function handleCreateControl(data: any) {
    console.log(data)
  }

  console.log()

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
            onClick={handleSubmit(handleCreateControl)}
            className="flex h-full flex-col gap-3"
          >
            <Form.Field>
              <Form.Label>Descrição:</Form.Label>
              <Form.Input name="description" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Form.Field>
              <Form.Label>Cor:</Form.Label>
              <input type="color" />
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
              <Form.Label>Tipo:</Form.Label>
              <Form.Select
                name="type"
                options={[{ label: 'STATUS', value: '1' }]}
              />
              <Form.ErrorMessage field="type" />
            </Form.Field>

            <div className="flex h-full flex-1 flex-col gap-3 overflow-auto">
              {icons.map((icon) => {
                const currentIcon = icon as keyof typeof dynamicIconImports
                const Icon = dynamicNext(dynamicIconImports[currentIcon])
                return (
                  <Button
                    variant="outline"
                    type="button"
                    className="h-full w-full"
                    key={icon}
                  >
                    <Icon />
                    {icon}
                  </Button>
                )
              })}
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

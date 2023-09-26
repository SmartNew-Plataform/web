'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormProvider, useForm } from 'react-hook-form'

export function HeaderNewTask() {
  const newTaskForm = useForm()

  return (
    <Card className="flex gap-3 p-4">
      <FormProvider {...newTaskForm}>
        <form className="flex items-end gap-3">
          <Form.Field>
            <Form.Label>Cliente:</Form.Label>
            <Form.Select
              name="branch"
              options={[{ label: 'INDIARA', value: '1' }]}
            />
          </Form.Field>
          <Form.Field>
            <Form.Label>Titulo:</Form.Label>
            <Form.Input name="branch" />
          </Form.Field>
          <Button>Salvar tarefa</Button>
        </form>
      </FormProvider>
    </Card>
  )
}

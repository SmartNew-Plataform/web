'use client'
import { Form } from '@/components/form'

export function StepTwo() {
  return (
    <>
      <Form.Field>
        <Form.Label htmlFor="description">Descrição:</Form.Label>
        <Form.Input name="description" id="description" />
        <Form.ErrorMessage field="description" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="observation">Observações:</Form.Label>
        <Form.Textarea name="observation" id="observation" />
        <Form.ErrorMessage field="observation" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="dataSheet">Ficha técnica:</Form.Label>
        <Form.Textarea name="dataSheet" id="dataSheet" />
        <Form.ErrorMessage field="dataSheet" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="images">Images:</Form.Label>
        <Form.ImagePicker name="images" id="images" />
        <Form.ErrorMessage field="images" />
      </Form.Field>
    </>
  )
}

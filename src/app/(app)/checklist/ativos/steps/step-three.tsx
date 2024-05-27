'use client'
import { Form } from '@/components/form'

export function StepThree() {
  return (
    <>
      <Form.Field>
        <Form.Label htmlFor="equipmentType">Tipo de Equipamento:</Form.Label>
        <Form.Input name="equipmentType" id="equipmentType" />
        <Form.ErrorMessage field="equipmentType" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="brand">Marca:</Form.Label>
        <Form.Input name="brand" id="brand" />
        <Form.ErrorMessage field="brand" />
      </Form.Field>
    </>
  )
}

import { Form } from '@/components/form'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

export function StepThree() {
  const { setValue, watch } = useFormContext()

  const mode = watch('type')

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setValue('date', today)
  }, [setValue])

  return (
    <>
      {mode === 'EXTERNO' && (
        <>
          <Form.Field>
            <Form.Label htmlFor="receipt">Nota Fiscal:</Form.Label>
            <Form.Input name="receipt" id="receipt" />
            <Form.ErrorMessage field="receipt" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="request">N. Requisição:</Form.Label>
            <Form.Input name="request" id="request" />
            <Form.ErrorMessage field="request" />
          </Form.Field>
        </>
      )}
      <Form.Field>
        <Form.Label htmlFor="date">Data abastecimento:</Form.Label>
        <Form.Input type="date" name="date" id="date" />
        <Form.ErrorMessage field="date" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="comments">Observações:</Form.Label>
        <Form.Input name="comments" id="comments" />
        <Form.ErrorMessage field="comments" />
      </Form.Field>
    </>
  )
}

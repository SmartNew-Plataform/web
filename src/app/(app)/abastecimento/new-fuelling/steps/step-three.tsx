import { Form } from '@/components/form'

export function StepThree() {
  return (
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
      <Form.Field>
        <Form.Label htmlFor="date">Data abastecimento:</Form.Label>
        <Form.Input type="date" name="date" id="date" />
        <Form.ErrorMessage field="date" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="fuel">Combustível:</Form.Label>
        <Form.Select name="fuel" id="fuel" />
        <Form.ErrorMessage field="fuel" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="comments">Observações:</Form.Label>
        <Form.Input name="comments" id="comments" />
        <Form.ErrorMessage field="comments" />
      </Form.Field>
      <Form.Field className="pb-4">
        <Form.Label htmlFor="comments">Imagens</Form.Label>
        <Form.ImagePicker accept="image/*" name="images" />
        <Form.ErrorMessage field="comments" />
      </Form.Field>
    </>
  )
}

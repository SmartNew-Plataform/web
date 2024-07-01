import { Form } from '@/components/form'

export function StepTwo() {
  return (
    <>
      <Form.Field>
        <Form.Label htmlFor="quantity">Quantidade de litros:</Form.Label>
        <Form.Input
          placeholder="17,0"
          type="number"
          name="quantity"
          id="quantity"
        />
        <Form.ErrorMessage field="quantity" />
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="accomplished">Consumo realizado:</Form.Label>
        <Form.Input
          placeholder="100,00"
          type="number"
          name="accomplished"
          id="accomplished"
        />
        <Form.ErrorMessage field="accomplished" />
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="last">Contador anterior:</Form.Label>
        <Form.Input type="number" name="last" id="last" readOnly />
        <Form.ErrorMessage field="last" />
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="counter">Contador atual:</Form.Label>
        <Form.Input type="number" name="counter" id="counter" />
        <Form.ErrorMessage field="counter" />
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="value">Valor Unitário:</Form.Label>
        <Form.Input placeholder="5,96" type="number" name="value" id="value" />
        <Form.ErrorMessage field="value" />
      </Form.Field>
      {/* <Form.Field>
        <Form.Label htmlFor="total">Custo total:</Form.Label>
        <Form.Input type="number" name="total" id="total" />
        <Form.ErrorMessage field="total" />
      </Form.Field> */}
    </>
  )
}

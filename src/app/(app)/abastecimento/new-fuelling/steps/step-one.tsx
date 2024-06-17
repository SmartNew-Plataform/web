'use client'
import { Form } from '@/components/form'
import { useActives } from '@/store/smartlist/actives'

export function StepOne() {
  const { selects } = useActives()

  return (
    <>
      <Form.Field>
        <Form.Label htmlFor="tag">TAG:</Form.Label>
        <Form.Input name="tag" id="tag" />
        <Form.ErrorMessage field="tag" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="type">Tipo:</Form.Label>
        <Form.Select name="type" id="type" options={selects.typeEquipment} />
        <Form.ErrorMessage field="type" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="drive">Motorista:</Form.Label>
        <Form.Input name="drive" id="drive" />
        <Form.ErrorMessage field="drive" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="filial">Filial:</Form.Label>
        <Form.Select name="filial" id="filial" options={selects.family} />
        <Form.ErrorMessage field="filial" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="post">Nome do Posto:</Form.Label>
        <Form.Input name="post" id="post" />
        <Form.ErrorMessage field="post" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="fuel">Combustível:</Form.Label>
        <Form.Select name="fuel" id="fuel" />
        <Form.ErrorMessage field="fuel" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="quantidy">Quantidade:</Form.Label>
        <Form.Input name="quantidy" id="quantidy" placeholder="0,01" />
        <Form.ErrorMessage field="quantidy" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="price">Custo UN:</Form.Label>
        <Form.Input name="price" id="price" placeholder="0,01" />
        <Form.ErrorMessage field="price" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="date">Data Abastecimento:</Form.Label>
        <Form.DatePicker name="date" id="date" />
        <Form.ErrorMessage field="date" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="comments">Observações:</Form.Label>
        <Form.Textarea name="comments" id="comments" />
        <Form.ErrorMessage field="comments" />
      </Form.Field>
    </>
  )
}

'use client'
import { Form } from '@/components/form'
import { useActives } from '@/store/smartlist/actives'

export function StepOne() {
  const { selects } = useActives()

  return (
    <>
      {selects.client ? (
        <Form.Field>
          <Form.Label htmlFor="client">Cliente:</Form.Label>
          <Form.Select name="client" id="client" options={selects.client} />
          <Form.ErrorMessage field="client" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      <Form.Field>
        <Form.Label htmlFor="equipment">Equipamento:</Form.Label>
        <Form.Input name="equipment" id="equipment" />
        <Form.ErrorMessage field="equipment" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="description">Descrição:</Form.Label>
        <Form.Input name="description" id="description" />
        <Form.ErrorMessage field="description" />
      </Form.Field>

      {selects.family ? (
        <Form.Field>
          <Form.Label htmlFor="family">Familia:</Form.Label>
          <Form.Select name="family" id="family" options={selects.family} />
          <Form.ErrorMessage field="family" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      <Form.Field>
        <Form.Label htmlFor="manufacturer">Fabricante:</Form.Label>
        <Form.Input name="manufacturer" id="manufacturer" />
        <Form.ErrorMessage field="manufacturer" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="model">Modelo:</Form.Label>
        <Form.Input name="model" id="model" />
        <Form.ErrorMessage field="model" />
      </Form.Field>
    </>
  )
}

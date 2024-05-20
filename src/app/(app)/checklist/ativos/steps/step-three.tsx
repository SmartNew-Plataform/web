'use client'
import { Form } from '@/components/form'
import { useActives } from '@/store/smartlist/actives'

export function StepThree() {
  const { selects } = useActives()
  return (
    <>
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
        <Form.Label htmlFor="equipmentType">Tipo de Equipamento:</Form.Label>
        <Form.Input name="equipmentType" id="equipmentType" />
        <Form.ErrorMessage field="equipmentType" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="manufacturer">Fabricante:</Form.Label>
        <Form.Input name="manufacturer" id="manufacturer" />
        <Form.ErrorMessage field="manufacturer" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="brand">Marca:</Form.Label>
        <Form.Input name="brand" id="brand" />
        <Form.ErrorMessage field="brand" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="model">Modelo:</Form.Label>
        <Form.Input name="model" id="model" />
        <Form.ErrorMessage field="model" />
      </Form.Field>
    </>
  )
}

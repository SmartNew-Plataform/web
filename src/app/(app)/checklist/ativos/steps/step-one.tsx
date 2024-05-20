'use client'
import { Form } from '@/components/form'
import { useActives } from '@/store/smartlist/actives'

export function StepOne() {
  const { selects } = useActives()
  console.log(selects)

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

      {selects.equipmentDad ? (
        <Form.Field>
          <Form.Label htmlFor="equipmentDad">Equipamento Pai:</Form.Label>
          <Form.Select
            name="equipmentDad"
            id="equipmentDad"
            options={selects.equipmentDad}
          />
          <Form.ErrorMessage field="equipmentDad" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      <Form.Field>
        <Form.Label htmlFor="patrimonyNumber">Nº Patrimonio:</Form.Label>
        <Form.Input name="patrimonyNumber" id="patrimonyNumber" />
        <Form.ErrorMessage field="patrimonyNumber" />
      </Form.Field>

      {selects.costCenter ? (
        <Form.Field>
          <Form.Label htmlFor="costCenter">Centro de Custo:</Form.Label>
          <Form.Select
            name="costCenter"
            id="costCenter"
            options={selects.costCenter}
          />
          <Form.ErrorMessage field="costCenter" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}
    </>
  )
}

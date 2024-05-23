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

      {selects.consumptionType ? (
        <Form.Field>
          <Form.Label htmlFor="consumptionType">Tipo de Consumo:</Form.Label>
          <Form.Select
            name="consumptionType"
            id="consumptionType"
            options={selects.consumptionType}
          />
          <Form.ErrorMessage field="consumptionType" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      <Form.Field>
        <Form.Label htmlFor="consumptionFuel">
          Consumo de Combustível:
        </Form.Label>
        <Form.Input
          type="number"
          step="any"
          name="consumptionFuel"
          id="consumptionFuel"
        />
        <Form.ErrorMessage field="consumptionFuel" />
      </Form.Field>
    </>
  )
}

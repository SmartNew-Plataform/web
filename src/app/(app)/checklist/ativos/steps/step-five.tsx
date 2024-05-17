'use client'
import { Form } from '@/components/form'
import { useActives } from '@/store/smartlist/actives'

export function StepFive() {
  const { selects } = useActives()

  return (
    <>
      {selects.equipmentStatus ? (
        <Form.Field>
          <Form.Label htmlFor="equipmentStatus">
            Status do Equipamento:
          </Form.Label>
          <Form.Select
            name="equipmentStatus"
            id="equipmentStatus"
            options={selects.equipmentStatus}
          />
          <Form.ErrorMessage field="equipmentStatus" />
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

      {selects.unityMeter ? (
        <Form.Field>
          <Form.Label htmlFor="unityMeter">Unidade de Medida:</Form.Label>
          <Form.Select
            name="unityMeter"
            id="unityMeter"
            options={selects.unityMeter}
          />
          <Form.ErrorMessage field="unityMeter" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      <Form.Field>
        <Form.Label htmlFor="owner">Proprietário:</Form.Label>
        <Form.Input name="owner" id="owner" />
        <Form.ErrorMessage field="owner" />
      </Form.Field>

      {selects.fleet ? (
        <Form.Field>
          <Form.Label htmlFor="fleet">Frota:</Form.Label>
          <Form.Select name="fleet" id="fleet" options={selects.fleet} />
          <Form.ErrorMessage field="fleet" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}
    </>
  )
}

'use client'
import { Form } from '@/components/form'
import { useActives } from '@/store/smartlist/actives'

export function StepThree() {
  const { selects } = useActives()
  return (
    <>
      {selects.typeEquipment ? (
        <Form.Field>
          <Form.Label htmlFor="equipmentType">Tipo de Equipamento:</Form.Label>
          <Form.Select
            options={selects.typeEquipment}
            name="equipmentType"
            id="equipmentType"
          />
          <Form.ErrorMessage field="equipmentType" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}
    </>
  )
}

'use client'
import { Form } from '@/components/form'
import { useServiceOrder } from '@/store/maintenance/service-order'
import { useFormContext } from 'react-hook-form'

export function StepOne() {
  const { selects } = useServiceOrder()
  const { watch, setValue } = useFormContext()
  const branch = watch('branch')

  console.log('branch => ', branch)
  return (
    <>
      {selects.equipment ? (
        <Form.Field>
          <Form.Label htmlFor="equipment">Equipamento:</Form.Label>
          <Form.Select
            name="equipment"
            id="equipment"
            options={selects.equipment}
            placeholder="Selecione um equipamento..."
            onChange={(value) => setValue('branch', value)}
          />
          <Form.ErrorMessage field="equipment" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      <Form.Field>
        <Form.Label htmlFor="branch">Cliente:</Form.Label>
        <Form.Input
          name="branch"
          id="branch"
          disabled
          value={watch('branch')}
        />
        <Form.ErrorMessage field="branch" />
      </Form.Field>

      {selects.typeMaintenance ? (
        <Form.Field>
          <Form.Label htmlFor="typeMaintenance">Tipo Manutenção:</Form.Label>
          <Form.Select
            name="typeMaintenance"
            id="typeMaintenance"
            options={selects.typeMaintenance}
          />
          <Form.ErrorMessage field="typeMaintenance" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}
    </>
  )
}

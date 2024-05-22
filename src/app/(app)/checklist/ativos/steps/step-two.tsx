'use client'
import { Form } from '@/components/form'
import { useActives } from '@/store/smartlist/actives'
import { StepFive } from './step-five'
import { StepFour } from './step-four'
import { StepSeven } from './step-seven'
import { StepSix } from './step-six'
import { StepThree } from './step-three'

export function StepTwo() {
  const { selects } = useActives()

  return (
    <>
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

      <Form.Field>
        <Form.Label htmlFor="observation">Observações:</Form.Label>
        <Form.Textarea name="observation" id="observation" />
        <Form.ErrorMessage field="observation" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="dataSheet">Ficha técnica:</Form.Label>
        <Form.Textarea name="dataSheet" id="dataSheet" />
        <Form.ErrorMessage field="dataSheet" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="images">Images:</Form.Label>
        <Form.ImagePicker name="images" id="images" />
        <Form.ErrorMessage field="images" />
      </Form.Field>

      <StepThree />

      <StepFour />

      <StepFive />

      <StepSix />

      <StepSeven />
    </>
  )
}

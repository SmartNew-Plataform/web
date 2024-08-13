import { Form } from '@/components/form'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

export function StepTwo() {
  const { watch, setValue } = useFormContext()

  const handleCalculateConsumption = () => {
    const quantity = parseFloat(watch('quantity'))
    const last = parseFloat(watch('last'))
    const counter = parseFloat(watch('counter'))
    const type = watch('typeEquipment')

    if (
      type === 'KM/L' &&
      !isNaN(quantity) &&
      !isNaN(last) &&
      !isNaN(counter)
    ) {
      const consumption = quantity / (counter - last)
      setValue('consumption', consumption.toFixed(2))
    } else if (type === 'L/HR') {
      const consumption = (counter - last) / quantity
      setValue('consumption', consumption.toFixed(2))
    }
  }

  useEffect(() => {
    handleCalculateConsumption()
  }, [watch('quantity'), watch('last'), watch('counter')])

  return (
    <>
      <Form.Field>
        <Form.Label htmlFor="odometerPrevious">Odômetro anterior:</Form.Label>
        <Form.Input
          type="number"
          name="odometerPrevious"
          id="odometerPrevious"
          readOnly
        />
        <Form.ErrorMessage field="odometerPrevious" />
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="odometer">Odômetro atual:</Form.Label>
        <Form.Input type="number" name="odometer" id="odometer" readOnly />
        <Form.ErrorMessage field="odometer" />
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
        <Form.Field>
          <Form.Label htmlFor="consumption">Consumo realizado:</Form.Label>
          <Form.Input
            type="number"
            name="consumption"
            id="consumption"
            readOnly
          />
          <Form.ErrorMessage field="consumption" />
        </Form.Field>
        <Form.Label htmlFor="value">Valor Unitário:</Form.Label>
        <Form.Input placeholder="5,96" type="number" name="value" id="value" />
        <Form.ErrorMessage field="value" />
      </Form.Field>
    </>
  )
}

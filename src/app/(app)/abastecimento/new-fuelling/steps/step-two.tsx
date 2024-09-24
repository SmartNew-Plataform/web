import { Form } from '@/components/form'
import { toast } from '@/components/ui/use-toast'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

export function StepTwo() {
  const { watch, setValue } = useFormContext()
  const quantity = parseFloat(watch('quantity'))
  const last = parseFloat(watch('last'))
  const counter = parseFloat(watch('counter'))
  const type = watch('typeEquipment')

  // const typeConsumption = selects?.equipment.find(
  //   ({ value }) => value === equipmentValue,
  // )?.type

  const handleCalculateConsumption = () => {
    console.log(type)

    if (!type) {
      toast({
        title: 'Equipamento selecionado sem tipo de consumo informado!',
        variant: 'destructive',
      })
    } else {
      if (
        type === 'KM/L' &&
        !isNaN(quantity) &&
        !isNaN(last) &&
        !isNaN(counter) &&
        last > 0
      ) {
        const consumption = quantity / (counter - last)
        setValue('consumption', consumption.toFixed(2))
      } else if (
        type === 'L/HR' &&
        !isNaN(quantity) &&
        !isNaN(last) &&
        !isNaN(counter) &&
        last > 0
      ) {
        const consumption = (counter - last) / quantity
        setValue('consumption', consumption.toFixed(2))
      } else {
        setValue('consumption', 0)
      }
    }
  }

  useEffect(() => {
    // if (isEdit) return
    handleCalculateConsumption()
    console.log(counter, last, quantity)
  }, [quantity, type, last, counter])

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
        <Form.Label htmlFor="consumption">Consumo realizado:</Form.Label>
        <Form.Input
          type="number"
          name="consumption"
          id="consumption"
          readOnly
        />
        <Form.ErrorMessage field="consumption" />
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="value">Valor Unitário:</Form.Label>
        <Form.Input type="number" name="value" id="value" />
        <Form.ErrorMessage field="value" />
      </Form.Field>
    </>
  )
}

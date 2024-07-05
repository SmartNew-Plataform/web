'use client'
import { TrainData } from '@/@types/fuelling-fuelling'
import { TankResponse } from '@/@types/fuelling-tank'
import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

export type EquipmentResponse = SelectData & {
  type: 'KM/L' | 'L/HR'
  counter: number
}

export type FuelType = {
  value: string
  label: string
  unity: string
}

export function StepOne() {
  async function loadSelects() {
    const response = await api
      .get<{ data: TankResponse[] }>(`fuelling/tank`)
      .then((response) => response.data)
    const responseTrain = await api
      .get<{ data: TrainData[] }>(`fuelling/train`)
      .then((response) => response.data)
    const responsePost = await api
      .get<{ data: SelectData[] }>(`fuelling/list-fuel-station`)
      .then((response) => response.data)
    const responseDriver = await api
      .get<{ data: SelectData[] }>(`fuelling/list-driver`)
      .then((response) => response.data)
    const responseEquipament = await api
      .get<EquipmentResponse[]>(`fuelling/list-equipment`)
      .then((response) => response.data)
    const responseFuel = await api
      .get<{ data: FuelType[] }>(`fuelling/list-fuel`)
      .then((response) => response.data)

    return {
      tank: response.data,
      train: responseTrain.data,
      post: responsePost.data,
      driver: responseDriver.data,
      equipment: responseEquipament.map(({ type, counter, label, value }) => ({
        value,
        label,
        counter,
        type,
      })),
      fuel: responseFuel.data,
    }
  }

  const { data: selects, isLoading: isLoadingSelects } = useQuery({
    queryKey: ['fuelling/list-fuel'],
    queryFn: loadSelects,
  })

  const { watch, setValue } = useFormContext()
  const mode = watch('type')
  const supplier = watch('typeSupplier') as 'tank' | 'train' | 'post'

  const typeSupplierOptions = {
    tank: {
      label: 'Tanque',
      options: selects?.tank.map(({ id, tank, compartmentAll }) => ({
        label: tank,
        value: id.toString(),
        compartment: compartmentAll,
      })),
    },
    train: {
      label: 'Comboio',
      options: selects?.train.map(({ id, train, compartmentAll }) => ({
        label: train,
        value: id.toString(),
        compartment: compartmentAll,
      })),
    },
    post: {
      label: 'Posto',
      options: selects?.post.map(({ label, value }) => ({
        label,
        value,
        compartment: undefined,
      })),
    },
  }

  const supplierMethodValue = watch(supplier)
  const supplierMethodData = supplier
    ? typeSupplierOptions[supplier].options?.find(
        (item) => item.value === supplierMethodValue,
      )
    : undefined

  const compartmentOptions = supplierMethodData?.compartment
    ? supplierMethodData?.compartment.map(({ fuel, id, odometer }) => ({
        label: fuel.label,
        value: id.toString(),
        odometer,
      }))
    : undefined

  const compartmentValue = watch('compartment')

  const odometer = compartmentOptions?.find(
    ({ value }) => value === compartmentValue,
  )?.odometer

  const quantity = watch('quantity')

  const quantityValue = parseFloat(quantity)

  const odometerCurrent =
    odometer !== undefined ? odometer + quantityValue : undefined

  const equipmentValue = watch('equipment')
  const counter = selects?.equipment.find(
    ({ value }) => value === equipmentValue,
  )?.counter

  const typeConsumption = selects?.equipment.find(
    ({ value }) => value === equipmentValue,
  )?.type

  useEffect(() => {
    setValue('last', counter)
    setValue('typeEquipment', typeConsumption)
  }, [equipmentValue])

  useEffect(() => {
    setValue('odometerPrevious', odometer)
    setValue('odometer', odometerCurrent)
  }, [compartmentValue, quantity])

  return (
    <>
      <Form.Field>
        <Form.Label>Tipo:</Form.Label>
        <Form.Select
          name="type"
          id="type"
          options={[
            {
              label: 'Interno',
              value: 'INTERNO',
            },
            {
              label: 'Externo',
              value: 'EXTERNO',
            },
          ]}
        />
        <Form.ErrorMessage field="type" />
      </Form.Field>

      {isLoadingSelects ? (
        <Form.SkeletonField />
      ) : (
        <Form.Field>
          <Form.Label htmlFor="equipment">Equipamento:</Form.Label>
          <Form.Select
            name="equipment"
            id="equipment"
            options={selects?.equipment}
          />
          <Form.ErrorMessage field="equipment" />
        </Form.Field>
      )}

      {mode === 'EXTERNO' ? (
        <Form.Field>
          <Form.Label>Tipo de abastecedor:</Form.Label>
          <Form.Select
            name="typeSupplier"
            id="typeSupplier"
            options={[
              {
                label: 'Tanque',
                value: 'tank',
              },
              {
                label: 'Posto',
                value: 'post',
              },
            ]}
          />
          <Form.ErrorMessage field="typeSupplier" />
        </Form.Field>
      ) : (
        <Form.Field>
          <Form.Label>Tipo de abastecedor:</Form.Label>
          <Form.Select
            name="typeSupplier"
            id="typeSupplier"
            options={[
              {
                label: 'Tanque',
                value: 'tank',
              },
              {
                label: 'Comboio',
                value: 'train',
              },
            ]}
          />
          <Form.ErrorMessage field="typeSupplier" />
        </Form.Field>
      )}
      {isLoadingSelects || !supplier ? (
        <Form.SkeletonField />
      ) : (
        <Form.Field>
          <Form.Label>{typeSupplierOptions[supplier].label}:</Form.Label>
          <Form.Select
            name={supplier}
            id={supplier}
            options={typeSupplierOptions[supplier].options}
          />
          <Form.ErrorMessage field="typeSupplier" />
        </Form.Field>
      )}
      {compartmentOptions ? (
        <Form.Field>
          <Form.Label>Compartimento:</Form.Label>
          <Form.Select
            name="compartment"
            id="compartment"
            options={compartmentOptions}
          />
          <Form.ErrorMessage field="compartment" />
        </Form.Field>
      ) : undefined}
      {selects?.fuel && (
        <Form.Field>
          <Form.Label htmlFor="fuel">Combustível:</Form.Label>
          <Form.Select name="fuel" id="fuel" options={selects?.fuel} />
          <Form.ErrorMessage field="fuel" />
        </Form.Field>
      )}
      {selects?.driver && (
        <Form.Field>
          <Form.Label htmlFor="driver">Motorista:</Form.Label>
          <Form.Select name="driver" id="driver" options={selects?.driver} />
          <Form.ErrorMessage field="driver" />
        </Form.Field>
      )}
      <Form.Field>
        <Form.Label htmlFor="quantity">Quantidade de litros:</Form.Label>
        <Form.Input type="number" name="quantity" id="quantity" />
        <Form.ErrorMessage field="quantity" />
      </Form.Field>
    </>
  )
}

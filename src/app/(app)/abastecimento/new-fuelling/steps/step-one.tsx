'use client'
import { TrainData } from '@/@types/fuelling-fuelling'
import { TankAndTrainResponse } from '@/@types/fuelling-tank'
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

interface StepOneProps {
  isEdit: boolean
}

export function StepOne({ isEdit }: StepOneProps) {
  async function loadSelects() {
    const [
      tankResponse,
      trainResponse,
      postResponse,
      driverResponse,
      equipmentResponse,
      fuelResponse,
    ] = await Promise.all([
      api
        .get<{ data: TankAndTrainResponse[] }>(`fuelling/tank`)
        .then((response) => response.data),
      api
        .get<{ data: TrainData[] }>(`fuelling/train`)
        .then((response) => response.data),
      api
        .get<{ data: SelectData[] }>(`fuelling/list-fuel-station`)
        .then((response) => response.data),
      api
        .get<{ data: SelectData[] }>(`fuelling/list-driver`)
        .then((response) => response.data),
      api
        .get<EquipmentResponse[]>(`fuelling/list-equipment`)
        .then((response) => response.data),
      api
        .get<{ data: FuelType[] }>(`fuelling/list-fuel`)
        .then((response) => response.data),
    ])

    return {
      tank: tankResponse.data,
      train: trainResponse.data,
      post: postResponse.data,
      driver: driverResponse.data,
      equipment: equipmentResponse.map(({ type, counter, label, value }) => ({
        value,
        label,
        counter,
        type,
      })),
      fuel: fuelResponse.data,
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
      options:
        selects?.tank.map(({ id, tank, compartmentAll, model }) => ({
          label: model + ' - ' + tank,
          value: id.toString(),
          compartment: compartmentAll,
        })) || [],
    },
    train: {
      label: 'Comboio',
      options:
        selects?.train.map(({ id, train, compartmentAll, tag }) => ({
          label: tag + ' - ' + train,
          value: id.toString(),
          compartment: compartmentAll,
        })) || [],
    },
    post: {
      label: 'Posto',
      options:
        selects?.post.map(({ label, value }) => ({
          label,
          value,
          compartment: [],
        })) || [],
    },
  }

  const supplierMethodValue = watch(supplier)
  const supplierMethodData =
    supplier && typeSupplierOptions[supplier]?.options
      ? typeSupplierOptions[supplier]?.options.find(
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
    if (isEdit) return
    setValue('typeEquipment', typeConsumption)
    setValue('last', counter)
  }, [equipmentValue, counter, selects])

  useEffect(() => {
    if (isEdit) return
    setValue('odometerPrevious', odometer)
    setValue('odometer', odometerCurrent)
  }, [compartmentValue, quantity, odometer, odometerCurrent])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setValue('date', today)
  }, [setValue])

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

      {supplier && (
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

      {compartmentOptions && supplier !== 'post' ? (
        <Form.Field>
          <Form.Label>Compartimento:</Form.Label>
          <Form.Select
            name="compartment"
            id="compartment"
            options={compartmentOptions}
          />
          <Form.ErrorMessage field="compartment" />
        </Form.Field>
      ) : null}

      {supplier === 'post' && selects?.fuel ? (
        <Form.Field>
          <Form.Label htmlFor="fuel">Combustível:</Form.Label>
          <Form.Select name="fuel" id="fuel" options={selects?.fuel} />
          <Form.ErrorMessage field="fuel" />
        </Form.Field>
      ) : null}

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

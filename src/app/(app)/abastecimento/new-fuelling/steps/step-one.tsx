'use client'
import { TrainData } from '@/@types/fuelling-fuelling'
import { TankResponse } from '@/@types/fuelling-tank'
import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { api } from '@/lib/api'
import { useFuelling } from '@/store/fuelling/fuelling'
import { useQuery } from '@tanstack/react-query'
import { useFormContext } from 'react-hook-form'

export function StepOne() {
  const { setCurrentCompartment } = useFuelling()

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

    return {
      tank: response.data,
      train: responseTrain.data,
      post: responsePost.data,
    }
  }

  const { data: selects, isLoading: isLoadingSelects } = useQuery({
    queryKey: ['fuelling/list-tank'],
    queryFn: loadSelects,
  })

  const { watch } = useFormContext()
  const mode = watch('mode')
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
    ? supplierMethodData?.compartment.map(({ fuel, id }) => ({
        label: fuel.label,
        value: id.toString(),
      }))
    : undefined

  const compartmentValue = watch('compartment')

  return (
    <>
      <Form.Field>
        <Form.Label>Tipo:</Form.Label>
        <Form.Select
          name="mode"
          id="mode"
          options={[
            {
              label: 'Interno',
              value: 'internal',
            },
            {
              label: 'Externo',
              value: 'external',
            },
          ]}
        />
        <Form.ErrorMessage field="mode" />
      </Form.Field>

      {mode === 'internal' ? (
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
          <Form.ErrorMessage field={supplier} />
        </Form.Field>
      )}
      {compartmentOptions && (
        <Form.Field>
          <Form.Label>Compartimento:</Form.Label>
          <Form.Select
            name="compartment"
            id="compartment"
            options={compartmentOptions}
          />
          <Form.ErrorMessage field="compartment" />
        </Form.Field>
      )}
      <Form.Field>
        <Form.Label htmlFor="drive">Motorista:</Form.Label>
        <Form.Input name="drive" id="drive" />
        <Form.ErrorMessage field="drive" />
      </Form.Field>
    </>
  )
}

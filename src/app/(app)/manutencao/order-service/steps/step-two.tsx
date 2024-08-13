'use client'
import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { useServiceOrder } from '@/store/maintenance/service-order'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ServiceOrderFormData } from '../table-service-order'

export function StepTwo() {
  const { selects } = useServiceOrder()
  const { watch, setValue } = useFormContext()
  const queryClient = useQueryClient()
  const [orderBondedData, setOrderBondedData] = useState<SelectData[]>([])

  const equipmentValue = watch('equipment')

  const equipmentData = selects.equipment?.find(
    (e) => e.value === equipmentValue,
  )
  const branchText = equipmentData?.branch.label

  useEffect(() => {
    async function fetchServiceOrder() {
      const allOrders: ServiceOrderFormData[] = await queryClient.getQueryData([
        'maintenance-service-order-table',
      ])
      const orderBondedData = allOrders.map(
        ({ id, descriptionRequest, codeServiceOrder }) => ({
          label: `${codeServiceOrder} - ${descriptionRequest}`,
          value: id.toString(),
        }),
      )

      setOrderBondedData(orderBondedData)
    }

    fetchServiceOrder()
  }, [])

  useEffect(() => {
    if (!branchText) return
    setValue('branch', branchText)
  }, [branchText])

  return (
    <>
      <Form.Field>
        <Form.Label htmlFor="orderBonded">Ordem vinculada:</Form.Label>
        <Form.Select
          options={orderBondedData}
          id="orderBonded"
          name="orderBonded"
        />
      </Form.Field>
      <Form.Field>
        <Form.Label>Maquina parada?</Form.Label>
        <Form.RadioGroup name="stoppedMachine" className="flex gap-4">
          <label className="font-sm flex items-center gap-2 text-zinc-700">
            <RadioGroupItem value="true" />
            Sim
          </label>
          <label className="font-sm flex items-center gap-2 text-zinc-700">
            <RadioGroupItem value="false" />
            Não
          </label>
        </Form.RadioGroup>
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="stoppedDate">Data de parada:</Form.Label>
        <Form.Input type="date" name="stoppedDate" id="stoppedDate" />
        <Form.ErrorMessage field="stoppedDate" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="deadlineDate">Data Prev. Termino:</Form.Label>
        <Form.Input type="date" name="deadlineDate" id="deadlineDate" />
        <Form.ErrorMessage field="deadlineDate" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="closingDate">Encerramento:</Form.Label>
        <Form.Input type="date" name="closingDate" id="closingDate" />
        <Form.ErrorMessage field="closingDate" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="dueDate">Data que funcionou:</Form.Label>
        <Form.Input type="date" name="dueDate" id="dueDate" />
        <Form.ErrorMessage field="dueDate" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="maintenanceDiagnosis">
          Diagnostico da manutenção:
        </Form.Label>
        <Form.Textarea name="maintenanceDiagnosis" id="maintenanceDiagnosis" />
        <Form.ErrorMessage field="maintenanceDiagnosis" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="solution">Solução:</Form.Label>
        <Form.Textarea name="solution" id="solution" />
        <Form.ErrorMessage field="solution" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="executorObservation">
          Observação do Executor:
        </Form.Label>
        <Form.Textarea name="executorObservation" id="executorObservation" />
        <Form.ErrorMessage field="executorObservation" />
      </Form.Field>
    </>
  )
}

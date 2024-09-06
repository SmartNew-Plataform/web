'use client'
import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { useServiceOrder } from '@/store/maintenance/service-order'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ServiceOrderData } from '../table-service-order'

export function StepTwo() {
  const { selects } = useServiceOrder()
  const queryClient = useQueryClient()
  const [orderBondedData, setOrderBondedData] = useState<SelectData[]>([])

  useEffect(() => {
    async function fetchServiceOrder() {
      const allOrders = (await queryClient.getQueryData([
        'maintenance-service-order-table',
      ])) as ServiceOrderData[]

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

  return (
    <>
      {!selects.maintainers ? (
        <Form.SkeletonField />
      ) : (
        <Form.Field>
          <Form.Label htmlFor="maintainers">Mantenedores:</Form.Label>
          <Form.MultiSelect
            options={selects.maintainers}
            id="maintainers"
            name="maintainers"
          />
        </Form.Field>
      )}
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

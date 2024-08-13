'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { useServiceOrder } from '@/store/maintenance/service-order'
import { Bolt } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { RequesterModal } from '../requester-modal'

export function StepOne() {
  const { selects } = useServiceOrder()
  const { watch, setValue } = useFormContext()
  const [requesterModalOpen, setRequesterModalOpen] = useState<boolean>(false)
  const equipmentValue = watch('equipment')

  const equipmentData = selects.equipment?.find(
    (e) => e.value === equipmentValue,
  )
  const branchText = equipmentData?.branch.label

  useEffect(() => {
    if (!branchText) return
    setValue('branch', branchText)
  }, [branchText])

  console.log(selects)

  return (
    <>
      {selects.requester ? (
        <Form.Field>
          <div className="flex items-end justify-between">
            <Form.Label htmlFor="requester" required>
              Solicitante:
            </Form.Label>
            <Button
              onClick={() => setRequesterModalOpen(true)}
              type="button"
              size="icon-xs"
              className="rounded-full"
            >
              <Bolt size={12} />
            </Button>
          </div>
          <Form.Select
            name="requester"
            id="requester"
            options={selects.requester}
          />
          <Form.ErrorMessage field="requester" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      {selects.equipment ? (
        <Form.Field>
          <Form.Label htmlFor="equipment">Equipamento:</Form.Label>
          <Form.Select
            name="equipment"
            id="equipment"
            options={selects.equipment}
            placeholder="Selecione um equipamento..."
          />
          <Form.ErrorMessage field="equipment" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      <Form.Field>
        <Form.Label htmlFor="branch">Cliente:</Form.Label>
        <Form.Input name="branch" id="branch" readOnly value={branchText} />
        <Form.ErrorMessage field="branch" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="hourMeter">Horímetro:</Form.Label>
        <Form.Input name="hourMeter" id="hourMeter" type="number" />
        <Form.ErrorMessage field="hourMeter" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="odometer">Odômetro:</Form.Label>
        <Form.Input name="odometer" id="odometer" type="number" />
        <Form.ErrorMessage field="odometer" />
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

      {selects.maintenanceSector ? (
        <Form.Field>
          <Form.Label htmlFor="maintenanceSector">Setor Manutenção:</Form.Label>
          <Form.Select
            name="maintenanceSector"
            id="maintenanceSector"
            options={selects.maintenanceSector}
          />
          <Form.ErrorMessage field="maintenanceSector" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      {selects.status ? (
        <Form.Field>
          <Form.Label htmlFor="status">Status:</Form.Label>
          <Form.Select name="status" id="status" options={selects.status} />
          <Form.ErrorMessage field="status" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      <Form.Field>
        <Form.Label htmlFor="requestDate">Data Solicitação:</Form.Label>
        <Form.Textarea id="requestDate" name="requestDate" />
        <Form.ErrorMessage field="requestDate" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="observation">Observação:</Form.Label>
        <Form.Textarea id="observation" name="observation" />
        <Form.ErrorMessage field="observation" />
      </Form.Field>

      <RequesterModal
        open={requesterModalOpen}
        onOpenChange={setRequesterModalOpen}
      />
    </>
  )
}

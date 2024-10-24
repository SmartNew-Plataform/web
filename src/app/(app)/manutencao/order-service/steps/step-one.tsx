'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useServiceOrder } from '@/store/maintenance/service-order'
import { Bolt } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { RequesterModal } from '../requester-modal'

export function StepOne() {
  const { selects } = useServiceOrder()
  const { watch, setValue } = useFormContext()
  const [requesterModalOpen, setRequesterModalOpen] = useState<boolean>(false)
  const [branchText, setBranchText] = useState<string | undefined>()
  const equipmentValue = watch('equipment')

  const equipmentData = selects.equipment?.find(
    (e) => e.value === equipmentValue,
  )
  const branchValue = equipmentData?.branch.value

  useEffect(() => {
    if (!branchValue) {
      setBranchText('')
      return
    }
    setValue('branch', branchValue)
    setBranchText(equipmentData?.branch.label)
  }, [equipmentValue, branchValue])

  return (
    <>
      {selects.requester ? (
        <Form.Field>
          <div className="flex items-end justify-between">
            <Form.Label required htmlFor="requester">
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
          <Form.Label required htmlFor="equipment">
            Equipamento:
          </Form.Label>
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
        <Form.Label required htmlFor="branch">
          Cliente:
        </Form.Label>
        <Input readOnly value={branchText} />
        <Form.Input type="hidden" name="branch" id="branch" readOnly />
        <Form.ErrorMessage field="branch" />
      </Form.Field>

      <Form.Field>
        <Form.Label required htmlFor="hourMeter">
          Horímetro:
        </Form.Label>
        <Form.Input name="hourMeter" id="hourMeter" type="number" />
        <Form.ErrorMessage field="hourMeter" />
      </Form.Field>

      <Form.Field>
        <Form.Label required htmlFor="odometer">
          Odômetro:
        </Form.Label>
        <Form.Input name="odometer" id="odometer" type="number" />
        <Form.ErrorMessage field="odometer" />
      </Form.Field>

      {selects.typeMaintenance ? (
        <Form.Field>
          <Form.Label required htmlFor="typeMaintenance">
            Tipo Manutenção:
          </Form.Label>
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
          <Form.Label required htmlFor="executantSector">
            Setor Executante:
          </Form.Label>
          <Form.Select
            name="executantSector"
            id="executantSector"
            options={selects.maintenanceSector}
          />
          <Form.ErrorMessage field="executantSector" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      {selects.status ? (
        <Form.Field>
          <Form.Label required htmlFor="status">
            Status:
          </Form.Label>
          <Form.Select name="status" id="status" options={selects.status?.map(status => ({
           label: status.name,
           value: status.id
          })) || []}  />
          <Form.ErrorMessage field="status" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      <Form.Field>
        <Form.Label required htmlFor="requestDate">
          Data Solicitação:
        </Form.Label>
        <Form.Input type="date" id="requestDate" name="requestDate" />
        <Form.ErrorMessage field="requestDate" />
      </Form.Field>

      <Form.Field>
        <Form.Label required htmlFor="equipmentFail">
          Falha Equipamento:
        </Form.Label>
        <Form.Textarea id="equipmentFail" name="equipmentFail" />
        <Form.ErrorMessage field="equipmentFail" />
      </Form.Field>

      <RequesterModal
        open={requesterModalOpen}
        onOpenChange={setRequesterModalOpen}
      />
    </>
  )
}

'use client'
import { AttachList } from '@/components/attach-list'
import { Form } from '@/components/form'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useLoading } from '@/store/loading-store'
import { useActives } from '@/store/smartlist/actives'
import { StepFive } from './step-five'
import { StepFour } from './step-four'
import { StepSix } from './step-six'
import { StepThree } from './step-three'

export function StepTwo() {
  const { selects, images, setImages, equipmentId } = useActives()
  const { toast } = useToast()
  const loading = useLoading()

  async function deleteAttach(url: string) {
    const urlSplit = url.split('/')
    const file = urlSplit[urlSplit.length - 1]

    loading.show()
    const response = await api.delete(
      `system/equipment/${equipmentId}/attach`,
      { data: { file } },
    )
    loading.hide()

    if (response.status !== 200) return

    const newImages = images?.filter((image) => !image.includes(file))
    setImages(newImages)

    toast({
      title: 'Anexo deletado com sucesso!',
      variant: 'success',
    })
  }

  return (
    <>
      {selects.costCenter ? (
        <Form.Field>
          <Form.Label htmlFor="costCenter">Centro de Custo:</Form.Label>
          <Form.Select
            name="costCenter"
            id="costCenter"
            options={selects.costCenter}
          />
          <Form.ErrorMessage field="costCenter" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      {selects.consumptionType ? (
        <Form.Field>
          <Form.Label htmlFor="consumptionType">Tipo de Consumo:</Form.Label>
          <Form.Select
            name="consumptionType"
            id="consumptionType"
            options={selects.consumptionType}
          />
          <Form.ErrorMessage field="consumptionType" />
        </Form.Field>
      ) : (
        <Form.SkeletonField />
      )}

      <Form.Field>
        <Form.Label htmlFor="consumptionFuel">
          Consumo de Combustível:
        </Form.Label>
        <Form.Input
          type="number"
          step="any"
          name="consumptionFuel"
          id="consumptionFuel"
        />
        <Form.ErrorMessage field="consumptionFuel" />
      </Form.Field>
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
        <Form.ImagePicker multiple name="images" id="images" />
        <Form.ErrorMessage field="images" />
      </Form.Field>

      <AttachList data={images || []} onDelete={deleteAttach} />

      <StepThree />

      <StepFour />

      <StepFive />

      <StepSix />
    </>
  )
}

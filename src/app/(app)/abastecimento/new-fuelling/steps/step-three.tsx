import { Form } from '@/components/form'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

type EquipmentResponse = {
  id: number
  equipmentCode: string
  description: string
}

export function StepThree() {
  async function loadSelects() {
    const response = await api
      .get<{ data: EquipmentResponse[] }>(`system/equipment`)
      .then((response) => response.data)
    return {
      equipment: response.data.map(({ id, equipmentCode, description }) => ({
        value: id.toString(),
        label: `${equipmentCode} - ${description}`,
      })),
    }
  }

  const { data: selects, isLoading: isLoadingSelects } = useQuery({
    queryKey: ['system/list-equipment'],
    queryFn: loadSelects,
  })
  return (
    <>
      <Form.Field>
        <Form.Label htmlFor="receipt">Nota Fiscal:</Form.Label>
        <Form.Input name="receipt" id="receipt" />
        <Form.ErrorMessage field="receipt" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="request">N. Requisição:</Form.Label>
        <Form.Input name="request" id="request" />
        <Form.ErrorMessage field="request" />
      </Form.Field>
      <Form.Field>
        <Form.Label htmlFor="date">Data abastecimento:</Form.Label>
        <Form.Input type="date" name="date" id="date" />
        <Form.ErrorMessage field="date" />
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
      {isLoadingSelects ? (
        <Form.SkeletonField />
      ) : (
        <Form.Field>
          <Form.Label htmlFor="fuel">Combustível:</Form.Label>
          <Form.Select name="fuel" id="fuel" options={selects?.equipment} />
          <Form.ErrorMessage field="fuel" />
        </Form.Field>
      )}

      <Form.Field>
        <Form.Label htmlFor="previous">Contador anterior:</Form.Label>
        <Form.Input type="number" name="previous" id="previous" />
        <Form.ErrorMessage field="previous" />
      </Form.Field>

      <Form.Field>
        <Form.Label htmlFor="comments">Observações:</Form.Label>
        <Form.Input name="comments" id="comments" />
        <Form.ErrorMessage field="comments" />
      </Form.Field>
      <Form.Field className="pb-4">
        <Form.Label htmlFor="comments">Imagens</Form.Label>
        <Form.ImagePicker accept="image/*" name="images" />
        <Form.ErrorMessage field="comments" />
      </Form.Field>
    </>
  )
}

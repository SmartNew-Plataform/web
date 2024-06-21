'use client'
import { FuellingType } from '@/@types/fuelling-fuelling'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const createSupplyFormSchema = z.object({
  drive: z.string({ required_error: 'Este campo é obrigatório!' }),
  post: z.string({ required_error: 'Este campo é obrigatório!' }),
  receipt: z.string({ required_error: 'Este campo é obrigatório!' }),
  request: z.string({ required_error: 'Este campo é obrigatório!' }),
  date: z.date({ required_error: 'Informe a data do abastecimento!' }),
  equipment: z.string({ required_error: 'Selecione o equipamento!' }),
  counter: z.coerce.number({ required_error: 'Este campo é obrigatório!' }),
  previous: z.coerce.number({ required_error: 'Este campo é obrigatório!' }),
  fuel: z.string({ required_error: 'Informe o combustível!' }),
  quantity: z.coerce.number({ required_error: 'Informe a quantidade!' }),
  accomplished: z.coerce.number({ required_error: 'Informe o consumo!' }),
  unitary: z.coerce.number({ required_error: 'Informe o valor unitário!' }),
  total: z.coerce.number({ required_error: 'Informe o custo total!' }),
})

type EquipmentResponse = {
  id: number
  equipmentCode: string
  description: string
}

export type SupplyFormData = z.infer<typeof createSupplyFormSchema>

interface SupplyModalProps extends ComponentProps<typeof Sheet> {
  mode: 'create' | 'edit'
  defaultValues?: FuellingType
}

export function FuelForm({ mode, ...props }: SupplyModalProps) {
  const createSupplyForm = useForm<SupplyFormData>({
    resolver: zodResolver(createSupplyFormSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = createSupplyForm

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

  const queryClient = useQueryClient()

  async function handleCreateFuelling({
    drive,
    post,
    receipt,
    request,
    date,
    equipment,
    fuel,
  }: SupplyFormData) {
    const response = await api.post('fuelling/post', {
      driver: drive,
      fuelStation: post,
      fiscalNumber: receipt,
      requestNumber: request,
      date,
      equipment,
      tankFuelling: fuel,
    })

    if (response.status !== 201) return

    toast({ title: 'Tanque criado com sucesso', variant: 'success' })

    queryClient.refetchQueries(['fuelling/new-fuelling'])
  }

  const { data: selects, isLoading: isLoadingSelects } = useQuery({
    queryKey: ['system/list-equipment'],
    queryFn: loadSelects,
  })
  return (
    <Sheet {...props}>
      <SheetContent className="flex max-h-screen w-1/4 flex-col overflow-x-hidden">
        <div className="mt-4 flex items-end justify-between border-b border-zinc-200 pb-4">
          <SheetTitle>Cadastrar abastecimento</SheetTitle>
        </div>
        <FormProvider {...createSupplyForm}>
          <form
            id="fuellingForm"
            onSubmit={handleSubmit(handleCreateFuelling)}
            className="mt-4 flex h-full w-full flex-col gap-3 overflow-auto overflow-x-hidden"
          >
            <Form.Field>
              <Form.Label htmlFor="drive">Motorista:</Form.Label>
              <Form.Input name="drive" id="drive" />
              <Form.ErrorMessage field="drive" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="post">Nome do posto:</Form.Label>
              <Form.Input name="post" id="post" />
              <Form.ErrorMessage field="post" />
            </Form.Field>
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
              <Form.DatePicker name="date" id="date" />
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
            <div className="flex w-full justify-around gap-2">
              <Form.Field>
                <Form.Label htmlFor="counter">Contador atual:</Form.Label>
                <Form.Input type="number" name="counter" id="counter" />
                <Form.ErrorMessage field="counter" />
              </Form.Field>
              <Form.Field>
                <Form.Label htmlFor="previous">Contador anterior:</Form.Label>
                <Form.Input type="number" name="previous" id="previous" />
                <Form.ErrorMessage field="previous" />
              </Form.Field>
            </div>
            {isLoadingSelects ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label htmlFor="fuel">Combustível:</Form.Label>
                <Form.Select
                  name="fuel"
                  id="fuel"
                  options={selects?.equipment}
                />
                <Form.ErrorMessage field="fuel" />
              </Form.Field>
            )}
            <Form.Field>
              <Form.Label htmlFor="quantity">Quantidade:</Form.Label>
              <Form.Input type="number" name="quantity" id="quantity" />
              <Form.ErrorMessage field="quantity" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="accomplished">Consumo realizado:</Form.Label>
              <Form.Input type="number" name="accomplished" id="accomplished" />
              <Form.ErrorMessage field="accomplished" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="unitary">Valor UN:</Form.Label>
              <Form.Input type="number" name="unitary" id="unitary" />
              <Form.ErrorMessage field="unitary" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="total">Custo total:</Form.Label>
              <Form.Input type="number" name="total" id="total" />
              <Form.ErrorMessage field="total" />
            </Form.Field>
            <Form.Field>
              <Form.Label htmlFor="comments">Observações:</Form.Label>
              <Form.Input name="comments" id="comments" />
              <Form.ErrorMessage field="comments" />
            </Form.Field>
          </form>
        </FormProvider>
        <Button
          loading={isSubmitting}
          disabled={isSubmitting}
          type="submit"
          className="pt-4"
          variant="success"
          form="fuellingForm"
        >
          <Save size={16} />
          Salvar
        </Button>
      </SheetContent>
    </Sheet>
  )
}

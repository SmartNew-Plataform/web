'use client'
import { TrainData } from '@/@types/fuelling-fuelling'
import { TankAndTrainResponse } from '@/@types/fuelling-tank'
import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface TankModalProps extends ComponentProps<typeof Dialog> {
  mode: 'create' | 'edit'
  defaultValues?: TankAndTrainResponse
}

const tankFormSchema = z.object({
  typeSupplier: z
    .string({ required_error: 'Este campo e obrigatório!' })
    .min(1),
  type: z
    .string({ required_error: 'Este campo e obrigatório!' })
    .min(1, 'Este campo e obrigatório!'),
  fiscalNumber: z.coerce.number().min(0),
  provider: z.string({ required_error: 'Escolha uma filial!' }),
  date: z.string({ required_error: 'Informe a data' }),
})

type TankFormData = z.infer<typeof tankFormSchema>

export function TankModal({ mode, defaultValues, ...props }: TankModalProps) {
  const tankForm = useForm<TankFormData>({
    resolver: zodResolver(tankFormSchema),
  })
  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = tankForm

  async function loadSelects() {
    const response = await api
      .get<{ data: TankAndTrainResponse[] }>(`fuelling/tank`)
      .then((response) => response.data)
    const responseTrain = await api
      .get<{ data: TrainData[] }>(`fuelling/train`)
      .then((response) => response.data)
    const responseDriver = await api
      .get<{ data: SelectData[] }>(`fuelling/list-driver`)
      .then((response) => response.data)
    const responseProvider = await api
      .get<SelectData[]>(`system/list-provider`)
      .then((response) => response.data)

    return {
      tank: response.data,
      train: responseTrain.data,
      driver: responseDriver.data,
      provider: responseProvider.map(({ value, label }) => ({
        value,
        label,
      })),
    }
  }

  const { data: selects, isLoading: isLoadingSelects } = useQuery({
    queryKey: ['fuelling/fuel-inlet'],
    queryFn: loadSelects,
  })

  const type = watch('typeSupplier') as 'tank' | 'train'

  const typeSupplierOptions = {
    tank: {
      label: 'Tanque',
      options:
        selects?.tank.map(({ id, tank, compartmentAll }) => ({
          label: tank,
          value: id.toString(),
          compartment: compartmentAll,
        })) || [],
    },
    train: {
      label: 'Comboio',
      options:
        selects?.train.map(({ id, train, compartmentAll }) => ({
          label: train,
          value: id.toString(),
          compartment: compartmentAll,
        })) || [],
    },
  }

  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleCreateTank({
    type,
    typeSupplier,
    fiscalNumber,
    provider,
  }: TankFormData) {
    const response = await api.post('fuelling/input', {
      type,
      typeSupplier,
      fiscalNumber,
      provider,
    })

    if (response.status !== 201) return

    toast({ title: 'Tanque criado com sucesso', variant: 'success' })

    queryClient.refetchQueries(['fuelling/create/data'])
  }

  async function handleEditTank({
    type: tag,
    typeSupplier: description,
    fiscalNumber: capacity,
    provider: branch,
  }: TankFormData) {
    const response = await api.put(`fuelling/tank/${defaultValues?.id}`, {
      model: tag,
      tank: description,
      capacity,
      branchId: branch,
    })
    if (response.status !== 200) return

    toast({
      title: 'Tanque atualizado com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['fuelling/create/data'])
  }

  useEffect(() => {
    if (mode === 'edit') {
      reset({
        type: defaultValues?.model,
        provider: defaultValues?.branch.value,
        fiscalNumber: defaultValues?.capacity,
        typeSupplier: defaultValues?.tank,
      })
    }
  }, [mode, defaultValues])

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...tankForm}>
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={handleSubmit(
              mode === 'edit' ? handleEditTank : handleCreateTank,
            )}
          >
            <Form.Field>
              <Form.Label htmlFor="typeSupplier">Tipo:</Form.Label>
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

            {isLoadingSelects || !type ? (
              <Form.SkeletonField />
            ) : (
              <Form.Field>
                <Form.Label>{typeSupplierOptions[type].label}:</Form.Label>
                <Form.Select
                  name={type}
                  id={type}
                  options={typeSupplierOptions[type].options}
                />
                <Form.ErrorMessage field="supplier" />
              </Form.Field>
            )}

            <Form.Field>
              <Form.Label htmlFor="fiscalNumber">Nota fiscal:</Form.Label>
              <Form.Input type="number" name="fiscalNumber" id="fiscalNumber" />
              <Form.ErrorMessage field="fiscalNumber" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="provider">Fornecedor:</Form.Label>
              <Form.Select
                name="provider"
                id="provider"
                options={selects?.provider}
              />
              <Form.ErrorMessage field="fuelling" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="date">Data da entrada:</Form.Label>
              <Form.Input type="date" name="date" id="date" />
              <Form.ErrorMessage field="date" />
            </Form.Field>
            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

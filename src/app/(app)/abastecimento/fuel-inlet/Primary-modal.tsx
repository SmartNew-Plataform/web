'use client'
import { TrainData } from '@/@types/fuelling-fuelling'
import { FuelInlet, TankAndTrainResponse } from '@/@types/fuelling-tank'
import { SelectData } from '@/@types/select-data'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { InputInlet } from '@/store/fuelling/input-inlet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface TankModalProps extends ComponentProps<typeof Dialog> {
  mode: 'create' | 'edit'
  defaultValues?: FuelInlet
}

const tankFormSchema = z.object({
  type: z.coerce.string({ required_error: 'Este campo e obrigatório!' }),
  typeSupplier: z
    .string({ required_error: 'Este campo e obrigatório!' })
    .min(1),
  fiscalNumber: z.coerce.string().min(0),
  provider: z.coerce.string({ required_error: 'Escolha uma filial!' }),
  date: z.coerce.string({ required_error: 'Informe a data' }),
  tank: z.string().optional(),
  train: z.string().optional(),
})

type TankFormData = z.infer<typeof tankFormSchema>

export function TankModal({ mode, defaultValues, ...props }: TankModalProps) {
  const { setTank, setTrain } = InputInlet()
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

    setTank(
      response.data.map((value) => {
        return {
          value: value.id.toString(),
          label: value.tank,
          comparment: value.compartmentAll.map((compart) => {
            return {
              value: compart.id.toString(),
              label: compart.fuel.label,
            }
          }),
        }
      }),
    )

    setTrain(
      responseTrain.data.map((value) => {
        return {
          value: value.id.toString(),
          label: value.train,
          comparment: value.compartmentAll.map((compart) => {
            return {
              value: compart.id.toString(),
              label: compart.fuel.label,
            }
          }),
        }
      }),
    )

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

  const {
    data: selects,
    isLoading: isLoadingSelects,
    refetch,
  } = useQuery({
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

  async function handleCreateTank(data: TankFormData) {
    const response = await api.post('fuelling/input', {
      type: data.type,
      trainId: data.train,
      tankId: data.tank,
      typeSupplier: data.typeSupplier,
      fiscalNumber: data.fiscalNumber,
      providerId: data.provider,
      date: data.date,
    })

    if (response.status !== 201) return

    toast({ title: 'Tanque criado com sucesso', variant: 'success' })

    queryClient.refetchQueries(['fuelling/create/data'])
    refetch()
  }

  async function handleEditTank(data: TankFormData) {
    const response = await api.put(`fuelling/input/${defaultValues?.id}`, {
      trainId: data.train,
      tankId: data.tank,
      typeSupplier: data.typeSupplier,
      fiscalNumber: data.fiscalNumber,
      providerId: data.provider,
      date: data.date,
    })
    if (response.status !== 200) return

    toast({
      title: 'Entrada atualizada com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['fuelling/create/data'])
  }

  useEffect(() => {
    if (mode === 'edit') {
      reset({
        typeSupplier: defaultValues?.type.value,
        type: defaultValues?.bound.value,
        fiscalNumber: defaultValues?.fiscalNumber,
        provider: defaultValues?.provider.value,
        date: dayjs(defaultValues?.date).format('YYYY-MM-DD'),
      })
    }
  }, [mode, defaultValues, reset])

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
                  options={typeSupplierOptions[type].options.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                />
                <Form.ErrorMessage field="type" />
              </Form.Field>
            )}

            <Form.Field>
              <Form.Label htmlFor="fiscalNumber">Nota fiscal:</Form.Label>
              <Form.Input name="fiscalNumber" id="fiscalNumber" />
              <Form.ErrorMessage field="fiscalNumber" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="provider">Fornecedor:</Form.Label>
              <Form.Select
                name="provider"
                id="provider"
                options={selects?.provider}
              />
              <Form.ErrorMessage field="provider" />
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

'use client'
import { TrainData } from '@/@types/fuelling-fuelling'
import { TankAndTrainResponse } from '@/@types/fuelling-tank'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { z } from 'zod'

interface TankModalProps extends ComponentProps<typeof Dialog> {
  mode: 'create' | 'edit'
  defaultValues?: TankAndTrainResponse
}

const tankFormSchema = z.object({
  description: z.string({ required_error: 'Este campo e obrigatório!' }).min(1),
  tag: z
    .string({ required_error: 'Este campo e obrigatório!' })
    .min(1, 'Este campo e obrigatório!'),
  capacity: z.coerce.number().min(0),
  branch: z.string({ required_error: 'Escolha uma filial!' }),
})

type TankFormData = z.infer<typeof tankFormSchema>

export function TankModal({ mode, defaultValues, ...props }: TankModalProps) {
  const tankForm = useForm<TankFormData>({
    resolver: zodResolver(tankFormSchema),
  })
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = tankForm

  async function loadSelects() {
    const response = await api
      .get<{ data: TankAndTrainResponse[] }>(`fuelling/tank`)
      .then((response) => response.data)
    const responseTrain = await api
      .get<{ data: TrainData[] }>(`fuelling/train`)
      .then((response) => response.data)

    return {
      tank: response.data,
      train: responseTrain.data,
    }
  }

  const { data: selects, isLoading: isLoadingSelects } = useQuery({
    queryKey: ['fuelling/inlet'],
    queryFn: loadSelects,
  })

  const { watch } = useFormContext()
  const supplier = watch('typeSupplier') as 'tank' | 'train'

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
  }

  const supplierMethodValue = watch(supplier)
  const supplierMethodData = supplier
    ? typeSupplierOptions[supplier].options?.find(
        (item) => item.value === supplierMethodValue,
      )
    : undefined

  const compartmentOptions = supplierMethodData?.compartment
    ? supplierMethodData?.compartment.map(({ fuel, id, odometer }) => ({
        label: fuel.label,
        value: id.toString(),
        odometer,
      }))
    : undefined

  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleCreateTank({
    tag,
    description,
    capacity,
    branch,
  }: TankFormData) {
    const response = await api.post('fuelling/tank', {
      model: tag,
      tank: description,
      capacity,
      branchId: branch,
    })

    if (response.status !== 201) return

    toast({ title: 'Tanque criado com sucesso', variant: 'success' })

    queryClient.refetchQueries(['fuelling/create/data'])
  }

  async function handleEditTank({
    tag,
    description,
    capacity,
    branch,
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
        tag: defaultValues?.model,
        branch: defaultValues?.branch.value,
        capacity: defaultValues?.capacity,
        description: defaultValues?.tank,
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
                <Form.ErrorMessage field="typeSupplier" />
              </Form.Field>
            )}

            {compartmentOptions ? (
              <Form.Field>
                <Form.Label>Compartimento:</Form.Label>
                <Form.Select
                  name="compartment"
                  id="compartment"
                  options={compartmentOptions}
                />
                <Form.ErrorMessage field="compartment" />
              </Form.Field>
            ) : undefined}

            <Form.Field>
              <Form.Label htmlFor="capacity-input">Quantidade:</Form.Label>
              <Form.Input name="capacity" id="capacity-input" type="number" />
              <Form.ErrorMessage field="capacity" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="fuelling-input">Abastecedor:</Form.Label>
              <Form.Select name="fuelling" id="fuelling" />
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

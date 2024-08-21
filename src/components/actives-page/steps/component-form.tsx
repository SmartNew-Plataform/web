'use client'
import { Component } from '@/@types/active'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useLoading } from '@/store/loading-store'
import { useActives } from '@/store/smartlist/actives'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface ComponentFormProps {
  defaultValues: Component
}

const componentFormSchema = z.object({
  description: z.string({ required_error: 'A descrição e obrigatória!' }),
  image: z.array(z.instanceof(File)).optional().nullable(),
  manufacturer: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  manufacturingYear: z.coerce.number().optional().nullable(),
  status: z.string({ required_error: 'O status e obrigatório!' }),
})

type ComponentFormData = z.infer<typeof componentFormSchema>

export function ComponentForm({ defaultValues }: ComponentFormProps) {
  const { selects, equipmentId, removeComponent } = useActives()
  const componentForm = useForm<ComponentFormData>({
    resolver: zodResolver(componentFormSchema),
  })
  const { toast } = useToast()
  const loading = useLoading()

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = componentForm

  useEffect(() => {
    if (!defaultValues) return
    reset(defaultValues)
  }, [defaultValues, reset])

  async function handleUpdateComponent(data: ComponentFormData) {
    const response = await api.put(
      `system/equipment/${equipmentId}/component/${defaultValues.id}`,
      data,
    )

    if (response.status !== 200) return

    toast({
      title: `${data.description} foi atualizado com sucesso!`,
      variant: 'success',
    })
  }

  async function handleDeleteComponent(componentId: number) {
    loading.show()
    const response = await api.delete(
      `system/equipment/${equipmentId}/component/${componentId}`,
    )
    loading.hide()

    if (response.status !== 200) return

    removeComponent(componentId)

    toast({
      title: 'Componente deletado com sucesso!',
      variant: 'success',
    })
  }

  return (
    <FormProvider {...componentForm}>
      <div className="relative flex w-full flex-col gap-3">
        <Form.Field>
          <Form.Label htmlFor="description">Descrição:</Form.Label>
          <Form.Input name="description" id="description" />
          <Form.ErrorMessage field="description" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="image">Foto:</Form.Label>
          <Form.ImagePicker name="image" id="image" />
          <Form.ErrorMessage field="image" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="manufacturer">Fabricante:</Form.Label>
          <Form.Input name="manufacturer" id="manufacturer" />
          <Form.ErrorMessage field="manufacturer" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="model">Modelo:</Form.Label>
          <Form.Input name="model" id="model" />
          <Form.ErrorMessage field="model" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="serialNumber">N° de serie:</Form.Label>
          <Form.Input name="serialNumber" id="serialNumber" />
          <Form.ErrorMessage field="serialNumber" />
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor="manufacturingYear">
            Ano de Fabricação:
          </Form.Label>
          <Form.Input
            name="manufacturingYear"
            id="manufacturingYear"
            type="number"
            min="1900"
            max="2099"
            step="1"
            value={new Date().getFullYear()}
          />
          <Form.ErrorMessage field="manufacturingYear" />
        </Form.Field>

        {selects.componentStatus ? (
          <Form.Field>
            <Form.Label htmlFor="status">Status:</Form.Label>
            <Form.Select
              id="status"
              name="status"
              options={selects.componentStatus}
            />
            <Form.ErrorMessage field="status" />
          </Form.Field>
        ) : (
          <Form.SkeletonField />
        )}

        <div className="sticky bottom-0 flex gap-3 py-2">
          <Button
            type="button"
            variant="destructive"
            className="flex-1"
            disabled={isSubmitting}
            onClick={() => handleDeleteComponent(defaultValues.id)}
          >
            <Trash2 size={16} />
            Remover
          </Button>

          <Button
            className="flex-1"
            disabled={isSubmitting}
            loading={isSubmitting}
            onClick={handleSubmit(handleUpdateComponent)}
          >
            <Save size={16} />
            Salvar
          </Button>
        </div>
      </div>
    </FormProvider>
  )
}

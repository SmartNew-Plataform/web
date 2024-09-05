'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Product } from './users'

interface ProductModalProps extends ComponentProps<typeof Dialog> {
  mode: 'create' | 'edit'
  defaultValues?: Product
  productId?: number
}

const productFormSchema = z.object({
  description: z.string().nonempty('Este campo é obrigatório!'),
  unity: z.string().nonempty('Este campo é obrigatório!'),
})

type ProductFormData = z.infer<typeof productFormSchema>

export function ProductModal({
  mode,
  defaultValues,
  productId,
  ...props
}: ProductModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues || {
      description: '',
      unity: '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = productForm

  async function handleCreateProduct(data: ProductFormData) {
    try {
      const response = await api.post('fuelling/product', {
        description: data.description,
        unity: data.unity,
      })

      if (response.status === 201) {
        toast({ title: 'Produto criado com sucesso!', variant: 'success' })
        queryClient.invalidateQueries(['fuelling/product'])
        reset()
      }
    } catch (error) {
      toast({ title: 'Erro ao criar produto!', variant: 'destructive' })
    }
  }

  async function handleEditProduct(data: ProductFormData) {
    try {
      if (!productId) return
      const response = await api.put(`fuelling/product/${productId}`, {
        description: data.description,
        unity: data.unity,
      })

      if (response.status === 200) {
        toast({ title: 'Produto editado com sucesso!', variant: 'success' })
        queryClient.invalidateQueries(['fuelling/product'])
        reset()
      }
    } catch (error) {
      toast({ title: 'Erro ao editar produto!', variant: 'destructive' })
    }
  }

  useEffect(() => {
    if (mode === 'edit' && defaultValues) {
      reset(defaultValues)
    }
  }, [mode, defaultValues, reset])

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...productForm}>
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={handleSubmit(
              mode === 'edit' ? handleEditProduct : handleCreateProduct,
            )}
          >
            <Form.Field>
              <Form.Label htmlFor="description">Produto:</Form.Label>
              <Form.Input name="description" id="description" />
              <Form.ErrorMessage field="description" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="unity">Unidade:</Form.Label>
              <Form.Input name="unity" id="unity" />
              <Form.ErrorMessage field="unity" />
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

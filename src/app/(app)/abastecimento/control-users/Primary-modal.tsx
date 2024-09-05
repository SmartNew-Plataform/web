'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { User } from './users'

interface UserModalProps extends ComponentProps<typeof Dialog> {
  mode: 'create' | 'edit'
  defaultValues?: User
  userId?: number
}

const userFormSchema = z.object({
  user: z.string(),
  branch: z.string(),
  type: z.string().nonempty('Este campo é obrigatório!'),
  password: z.string(),
  train: z.coerce.string().optional(),
})

type UserFormData = z.infer<typeof userFormSchema>

export function ProductModal({
  mode,
  defaultValues,
  userId,
  ...props
}: UserModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const productForm = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      user: '',
      branch: '',
      type: '',
      password: '',
      train: '',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    control,
  } = productForm

  const selectedType = useWatch({
    control,
    name: 'type',
  })

  async function fetchUserOptions() {
    const response = await api.get('system/choices/user')
    return response.data.data
  }

  async function fetchTrainOptions() {
    const response = await api.get('fuelling/list-train')
    return response.data.data
  }

  async function fechFilialOptions() {
    const response = await api.get('system/list-branch')
    return response.data.data
  }

  const { data: userOptions = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['system/choices/user'],
    queryFn: fetchUserOptions,
  })

  const { data: trainOptions = [], isLoading: isLoadingTrain } = useQuery({
    queryKey: ['fuelling/list-train'],
    queryFn: fetchTrainOptions,
  })

  const { data: filialOptions = [], isLoading: isLoadingFilial } = useQuery({
    queryKey: ['system/list-branch'],
    queryFn: fechFilialOptions,
  })

  async function handleCreateUser(data: UserFormData) {
    try {
      const response = await api.post('fuelling/control-user', {
        user: data.user,
        branchId: Number(data.branch),
        type: data.type,
        password: data.password,
        trainId: Number(data.train) || undefined,
      })

      if (response.status === 201) {
        toast({ title: 'Usuário vinculado com sucesso!', variant: 'success' })
        queryClient.invalidateQueries(['fuelling/product'])
        reset()
      }
    } catch (error) {
      toast({ title: 'Erro ao vincular usuário!', variant: 'destructive' })
    }
  }

  async function handleEditUser(data: UserFormData) {
    try {
      if (!userId) return
      const response = await api.put(`fuelling/control-user/${userId}`, {
        user: data.user,
        branchId: Number(data.branch),
        type: data.type,
        password: data.password,
        trainId: Number(data.train) || undefined,
      })

      if (response.status === 200) {
        toast({ title: 'Vinculo editado com sucesso!', variant: 'success' })
        queryClient.invalidateQueries(['fuelling/product'])
        reset()
      }
    } catch (error) {
      toast({ title: 'Erro ao editar vinculo!', variant: 'destructive' })
    }
  }

  useEffect(() => {
    if (mode === 'edit' && defaultValues) {
      reset({
        user: defaultValues.user.value,
        branch: defaultValues.branch.value,
        type: defaultValues.type.value,
        password: defaultValues.password,
        train: defaultValues.train?.value || '',
      })
    }
  }, [mode, defaultValues, reset])

  const typeOptions = [
    { value: 'driver', label: 'Motorista' },
    { value: 'supplier', label: 'Abastecedor' },
  ]

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...productForm}>
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={handleSubmit(
              mode === 'edit' ? handleEditUser : handleCreateUser,
            )}
          >
            <Form.Field>
              <Form.Label htmlFor="user">Usuário:</Form.Label>
              {isLoadingUsers ? (
                <p>Carregando usuários...</p>
              ) : (
                <Form.Select name="user" id="user" options={userOptions} />
              )}
              <Form.ErrorMessage field="user" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="branch">Filial:</Form.Label>
              {isLoadingFilial ? (
                <p>Carregando filiais...</p>
              ) : (
                <Form.Select
                  name="branch"
                  id="branch"
                  options={filialOptions}
                />
              )}
              <Form.ErrorMessage field="branch" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="type">Tipo:</Form.Label>
              <Form.Select options={typeOptions} name="type" id="type" />
              <Form.ErrorMessage field="type" />
            </Form.Field>

            {selectedType === 'supplier' && (
              <Form.Field>
                <Form.Label htmlFor="train">
                  Comboio: <span className="text-xs">(opcional)</span>
                </Form.Label>
                {isLoadingTrain ? (
                  <p>Carregando comboios...</p>
                ) : (
                  <Form.Select name="train" id="train" options={trainOptions} />
                )}
                <Form.ErrorMessage field="train" />
              </Form.Field>
            )}

            <Form.Field>
              <Form.Label htmlFor="password">Senha:</Form.Label>
              <Form.Input type="password" name="password" id="password" />
              <Form.ErrorMessage field="password" />
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

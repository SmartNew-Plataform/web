'use client'

import { EmissionData } from '@/@types/finance-emission'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const editEmissionSchema = z.object({
  observation: z.string(),
})

type EditEmissionType = z.infer<typeof editEmissionSchema>

interface EditEmissionModalProps extends ComponentProps<typeof Dialog> {
  data: EmissionData
}

export function EditEmissionModal({ data, ...props }: EditEmissionModalProps) {
  const editEmissionForm = useForm<EditEmissionType>()
  const { handleSubmit, setValue } = editEmissionForm
  const routeParams = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleEditEmission({ observation }: EditEmissionType) {
    const response = await api.put(
      `/financial/account/finance/${routeParams.emissionId}`,
      {
        application: `blank_financeiro_emissao_${routeParams.type}`,
        observation,
      },
    )

    if (response.status !== 200) return
    toast({
      title: 'Emissão editada com sucesso!',
      variant: 'success',
    })

    const data =
      (await queryClient.getQueryData<EmissionData>([
        'financial/account/emission/data',
      ])) || []

    console.log(data)

    queryClient.setQueryData(['financial/account/emission/data'], {
      ...data,
      description: observation,
    })
  }

  useEffect(() => {
    setValue('observation', data.description)
  }, [data])

  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...editEmissionForm}>
          <form
            onSubmit={handleSubmit(handleEditEmission)}
            className="flex flex-col gap-3"
          >
            <Form.Field>
              <Form.Label htmlFor="observation-input">Obervação:</Form.Label>
              <Form.Textarea id="observation-input" name="observation" />
              <Form.ErrorMessage field="observation" />
            </Form.Field>

            <Button>
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

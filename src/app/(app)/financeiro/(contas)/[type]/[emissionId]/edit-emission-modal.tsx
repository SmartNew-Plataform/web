'use client'

import { AttachResponse, EmissionData } from '@/@types/finance-emission'
import { AttachList } from '@/components/attach-list'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const editEmissionSchema = z.object({
  observation: z.string(),
  images: z.instanceof(File).array(),
})

type EditEmissionType = z.infer<typeof editEmissionSchema>

interface EditEmissionModalProps extends ComponentProps<typeof Dialog> {
  data: EmissionData
}

export function EditEmissionModal({ data, ...props }: EditEmissionModalProps) {
  const editEmissionForm = useForm<EditEmissionType>()
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = editEmissionForm
  const routeParams = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleEditEmission({ observation, images }: EditEmissionType) {
    const response = await api.put(
      `/financial/account/finance/${routeParams.emissionId}`,
      {
        application: `blank_financeiro_emissao_${routeParams.type}`,
        observation,
      },
    )

    images.map(async (file) => await createAttach(file))

    if (response.status !== 200) return
    reset({ images: [] })

    toast({
      title: 'Emissão editada com sucesso!',
      variant: 'success',
    })

    const data =
      (await queryClient.getQueryData<EmissionData>([
        'financial/account/emission/data',
      ])) || []

    queryClient.setQueryData(['financial/account/emission/data'], {
      ...data,
      description: observation,
    })

    queryClient.refetchQueries([
      `finance/account/emission/${routeParams.emissionId}/attach`,
    ])
  }

  async function deleteAttach(url: string) {
    const urlSplit = url.split('/')
    const response = await api.delete(
      `financial/account/finance/${routeParams.emissionId}/attach`,
      {
        data: {
          application: `blank_financeiro_emissao_${routeParams.type}`,
          file: urlSplit[urlSplit.length - 1],
        },
      },
    )

    if (response.status !== 200) return

    queryClient.refetchQueries([
      `finance/account/emission/${routeParams.emissionId}/attach`,
    ])
  }

  async function createAttach(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return await api.post(
      `financial/account/finance/${routeParams.emissionId}/attach?application=blank_financeiro_emissao_${routeParams.type}`,
      formData,
    )
  }

  async function fetchAttach() {
    const response = await api
      .get<{
        data: AttachResponse[]
      }>(`financial/account/finance/${routeParams.emissionId}/attach`, {
        params: {
          application: `blank_financeiro_emissao_${routeParams.type}`,
        },
      })
      .then((res) => res.data)

    return response.data.map(({ url }) => url)
  }

  const { data: attachments } = useQuery<string[]>({
    queryKey: [`finance/account/emission/${routeParams.emissionId}/attach`],
    queryFn: fetchAttach,
  })

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

            <Form.ImagePicker name="images" multiple />

            <AttachList data={attachments || []} onDelete={deleteAttach} />

            <Button disabled={isSubmitting} loading={isSubmitting}>
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

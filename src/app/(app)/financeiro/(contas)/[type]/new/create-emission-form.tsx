'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronLeft } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

type DocumentTypeData = {
  label: string
  value: string
  hasKey: boolean
  autoFiscal: boolean
  maxValue: number | null
}

type SelectsData = {
  documentType: DocumentTypeData[]
  branch: Array<{ label: string; value: string }>
  provider: Array<{ label: string; value: string }>
}

const schemaEmissionForm = z.object({
  documentType: z.string({ required_error: 'Tipo de documento e obrigatório' }),
  documentNumber: z.coerce.number({
    required_error: 'Numero de documento e obrigatório',
  }),
  accessKey: z.coerce.number().optional(),
  sender: z.string({ required_error: 'O emitente e obrigatório' }),
  issuer: z.string({ required_error: 'O remetente o obrigatório' }),
  emissionDate: z.string({ required_error: 'A data de emissão e obrigatória' }),
  observation: z.string({ required_error: 'A observação e obrigatória' }),
})

type EmissionFormData = z.infer<typeof schemaEmissionForm>

export function CreateEmissionForm() {
  const createEmissionForm = useForm<EmissionFormData>({
    resolver: zodResolver(schemaEmissionForm),
  })
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = createEmissionForm
  const routeParams = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  async function handleNewEmission({
    documentNumber,
    documentType,
    emissionDate,
    issuer,
    observation,
    sender,
    accessKey,
  }: EmissionFormData) {
    const response = await api
      .post('financial/account/finance', {
        type: routeParams.type,
        application: `blank_financeiro_emissao_${routeParams.type}`,
        typeDocument: Number(documentType),
        numberFiscal: documentNumber,
        emissionDate,
        issue: Number(issuer),
        observation,
        sender: Number(sender),
        key: accessKey?.toString() || '',
      })
      .then((res) => res.data)

    if (!response.inserted) return

    router.push(
      `${response.data.id}?h=hidden&token=${searchParams.get('token')}`,
    )
  }

  const { data } = useQuery<SelectsData>({
    queryKey: ['financial/accounts/new/selects'],
    queryFn: async () => {
      const params = {
        application: `blank_financeiro_emissao_${routeParams.type}`,
      }

      const [documentType, branch, provider] = await Promise.all([
        await api
          .get('financial/account/list-type-document', { params })
          .then((res) => res.data),
        await api
          .get('financial/account/list-branch', { params })
          .then((res) => res.data),
        await api
          .get('financial/account/list-provider', { params })
          .then((res) => res.data),
      ])

      return {
        documentType: documentType?.data || [],
        branch: branch?.data || [],
        provider: provider?.data || [],
      }
    },
  })

  const documentTypeValue = watch('documentType')
  const currentDocumentType = data?.documentType.find(
    ({ value }) => value === documentTypeValue,
  )

  useEffect(() => {
    const documentNumberValue: unknown = currentDocumentType?.autoFiscal
      ? String((currentDocumentType.maxValue ?? 0) + 1).padStart(5, '0')
      : '00000'

    setValue('documentNumber', documentNumberValue as number)
  }, [documentTypeValue])

  return (
    <FormProvider {...createEmissionForm}>
      <form
        className="mx-auto flex h-full w-96 flex-col gap-4 rounded border bg-white p-4 py-4 shadow-sm"
        onSubmit={handleSubmit(handleNewEmission)}
      >
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <ChevronLeft size={16} />
          </Button>
          <h2 className="text-xl font-bold text-zinc-700">
            Criar nova emissão
          </h2>
        </div>

        <div className="flex h-full flex-col gap-4 overflow-auto">
          <Suspense fallback={<Form.SkeletonField />}>
            <Form.Field>
              <Form.Label htmlFor="document-type-input">
                Tipo de documento:
              </Form.Label>
              <Form.Select
                name="documentType"
                id="document-type-input"
                options={data?.documentType || []}
              />
              <Form.ErrorMessage field="documentType" />
            </Form.Field>
          </Suspense>

          <Form.Field>
            <Form.Label htmlFor="document-number-input">
              N° Documento:
            </Form.Label>
            <Form.Input
              readOnly={currentDocumentType?.autoFiscal}
              type="number"
              name="documentNumber"
              id="document-number-input"
            />
            <Form.ErrorMessage field="documentNumber" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="access-key-input">Chave de acesso:</Form.Label>
            <Form.Input
              disabled={!currentDocumentType?.hasKey}
              type="number"
              name="accessKey"
              id="access-key-input"
            />
            <Form.ErrorMessage field="accessKey" />
          </Form.Field>

          <Suspense fallback={<Form.SkeletonField />}>
            <Form.Field>
              <Form.Label htmlFor="sender-input">
                Identificação do emitente:
              </Form.Label>
              <Form.Select
                name="sender"
                id="sender-input"
                options={
                  routeParams.type === 'pagar'
                    ? data?.branch || []
                    : data?.provider || []
                }
              />
              <Form.ErrorMessage field="sender" />
            </Form.Field>
          </Suspense>

          <Suspense fallback={<Form.SkeletonField />}>
            <Form.Field>
              <Form.Label htmlFor="issuer-input">
                Destinatário/Remetente:
              </Form.Label>
              <Form.Select
                name="issuer"
                id="issuer-input"
                options={
                  routeParams.type === 'pagar'
                    ? data?.provider || []
                    : data?.branch || []
                }
              />
              <Form.ErrorMessage field="issuer" />
            </Form.Field>
          </Suspense>

          <Form.Field>
            <Form.Label htmlFor="emission-date-input">
              Data de emissão:
            </Form.Label>
            <Form.Input
              type="date"
              name="emissionDate"
              id="emission-date-input"
            />
            <Form.ErrorMessage field="emissionDate" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="observation-input">Obervação:</Form.Label>
            <Form.Textarea name="observation" id="observation-input" />
            <Form.ErrorMessage field="observation" />
          </Form.Field>
        </div>
        <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
          <Check size={16} />
          Criar
        </Button>
      </form>
    </FormProvider>
  )
}

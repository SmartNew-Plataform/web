'use client'
import { SearchEmission } from '@/@types/finance-emission'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { useEmissionStore } from '@/store/financial/emission'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { ComponentProps, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface SearchEmissionModalProps extends ComponentProps<typeof Dialog> {}

const searchEmissionSchema = z.object(
  {
    fiscalNumber: z.coerce.number().optional(),
    issuer: z.coerce.number().optional(),
    sender: z.coerce.number().optional(),
    documentType: z.coerce.number().optional(),
  },
  { required_error: 'Este campo e obrigatório!' },
)

type SearchEmissionData = z.infer<typeof searchEmissionSchema>

export function SearchEmissionModal({ ...props }: SearchEmissionModalProps) {
  const searchEmissionForm = useForm<SearchEmissionData>({
    resolver: zodResolver(searchEmissionSchema),
  })
  const { handleSubmit } = searchEmissionForm
  const params = useParams()
  const searchParams = useSearchParams()
  const [data, setData] = useState<SearchEmission[] | undefined>([])
  const { fetchEmissionSelects, documentTypeData, providerData, branchData } =
    useEmissionStore(
      ({
        fetchEmissionSelects,
        documentTypeData,
        providerData,
        branchData,
      }) => ({
        fetchEmissionSelects,
        documentTypeData,
        providerData: providerData || [],
        branchData: branchData || [],
      }),
    )

  async function searchEmission({
    documentType,
    fiscalNumber,
    issuer,
    sender,
  }: SearchEmissionData) {
    const response = await api
      .get('/financial/account/finance/filter', {
        params: {
          application: `blank_financeiro_emissao_${params.type}`,
          type: params.type,
          documentType,
          fiscalNumber,
          issuer,
          sender,
        },
      })
      .then((res) => res.data)

    setData(response.data)
  }

  useEffect(() => {
    searchEmission({
      documentType: undefined,
      fiscalNumber: undefined,
      issuer: undefined,
      sender: undefined,
    })
    fetchEmissionSelects({ type: params.type as string })
  }, [])

  return (
    <Dialog {...props}>
      <DialogContent className="flex max-h-full max-w-2xl gap-4">
        <FormProvider {...searchEmissionForm}>
          <form
            onSubmit={handleSubmit(searchEmission)}
            className="flex flex-1 flex-col gap-3"
          >
            <Form.Field>
              <Form.Label htmlFor="fiscalNumber">Numero NF:</Form.Label>
              <Form.Input name="fiscalNumber" id="fiscalNumber" />
              <Form.ErrorMessage field="fiscalNumber" />
            </Form.Field>

            {documentTypeData ? (
              <Form.Field>
                <Form.Label htmlFor="documentType">
                  Tipo de documento:
                </Form.Label>
                <Form.Select
                  name="documentType"
                  id="documentType"
                  options={documentTypeData}
                />
                <Form.ErrorMessage field="documentType" />
              </Form.Field>
            ) : (
              <Form.SkeletonField />
            )}

            {providerData || branchData ? (
              <Form.Field>
                <Form.Label htmlFor="issuer">Emitente/Pagador:</Form.Label>
                <Form.Select
                  name="issuer"
                  id="issuer"
                  options={params.type === 'pagar' ? providerData : branchData}
                />
                <Form.ErrorMessage field="issuer" />
              </Form.Field>
            ) : (
              <Form.SkeletonField />
            )}

            {providerData || branchData ? (
              <Form.Field>
                <Form.Label htmlFor="sender">Remetente/Recebedor:</Form.Label>
                <Form.Select
                  name="sender"
                  id="sender"
                  options={params.type === 'pagar' ? branchData : providerData}
                />
                <Form.ErrorMessage field="sender" />
              </Form.Field>
            ) : (
              <Form.SkeletonField />
            )}

            <Button>
              <Search size={16} />
              Buscar
            </Button>
          </form>
        </FormProvider>
        <div className="flex max-h-full flex-1 flex-col gap-4 overflow-auto">
          {data?.map(({ id, issue, numberFiscal, sender }) => {
            return (
              <Card key={id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex flex-col gap-1">
                    <strong>{numberFiscal}</strong>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase text-slate-600">
                        Emitente:
                      </span>
                      <span className="text-zinc-500">{issue}</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase text-slate-600">
                        Remetente:
                      </span>
                      <span className="text-zinc-500">{sender}</span>
                    </div>
                  </div>
                  <Link
                    href={{
                      pathname: `../${params.type}/${id}`,
                      query: {
                        h: 'hidden',
                        token: searchParams.get('token'),
                      },
                    }}
                  >
                    <Button variant="outline">
                      <ChevronRight size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'
import { EmissionData } from '@/@types/finance-emission'
import { AlertModal } from '@/components/alert-modal'
import { PageHeader } from '@/components/page-header'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useEmissionStore } from '@/store/financial/emission'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  ChevronLeft,
  CreditCard,
  File,
  MoreVertical,
  Pencil,
  Plus,
  Rocket,
  Search,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { InstallmentSheet } from './(installments)/installment-sheet'
import { EditEmissionModal } from './edit-emission-modal'
import { ProductModal } from './product-modal'
import { RelaunchEmissionModal } from './relaunch-emission-modal'
import { SearchEmissionModal } from './search-emission-modal'

export function HeaderEmissionPage() {
  const [editModal, setEditModal] = useState(false)
  const [createModal, setCreateModal] = useState(false)
  const [detailsPaymentSheet, setDetailsPaymentSheet] = useState(false)
  const [searchEmissionModal, setSearchEmissionModal] = useState(false)
  const [relaunchEmissionModal, setRelaunchEmissionModal] = useState(false)
  const [deleteEmissionAlert, setDeleteEmissionAlert] = useState(false)
  const routeParams = useParams()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const router = useRouter()
  const { fetchEmissionData, editable } = useEmissionStore(
    ({ fetchEmissionData, editable }) => ({
      fetchEmissionData,
      editable,
    }),
  )

  const { data } = useQuery<EmissionData>({
    queryKey: ['financial/account/emission/data'],
    queryFn: () =>
      fetchEmissionData({
        type: routeParams.type as string,
        emissionId: routeParams.emissionId as string,
      }),
  })

  async function handleDeleteEmission() {
    const response = await api.delete(
      `financial/account/finance/${routeParams.emissionId}`,
      {
        data: {
          application: `blank_financeiro_emissao_${routeParams.type}`,
        },
      },
    )

    if (response.status !== 200) return

    toast({
      title: 'Emissão deletada com sucesso!',
      variant: 'success',
    })

    router.push(
      `../${routeParams.type}?h=hidden&token=${searchParams.get('token')}`,
    )
  }

  return (
    <PageHeader>
      <Accordion collapsible type="single" className="w-full">
        <AccordionItem value="header" className="w-full border-0">
          <AccordionTrigger className="justify-normal gap-4 p-0 hover:normal-case">
            <div className="flex items-center gap-4">
              <Link
                href={{
                  pathname: `../${routeParams.type}/`,
                  query: { token: searchParams.get('token'), h: 'hidden' },
                }}
              >
                <Button variant="outline" size="icon">
                  <ChevronLeft size={16} />
                </Button>
              </Link>
              <h2 className="text-xl font-bold text-zinc-700">Lançamento</h2>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={() => setDetailsPaymentSheet(true)}
              >
                <CreditCard size={16} />
                Detalhes de pagamento
              </Button>

              <Button onClick={() => setCreateModal(true)} disabled={!editable}>
                <Plus size={16} />
                Adicionar
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="mr-5">
                  <DropdownMenuItem
                    onClick={() => setSearchEmissionModal(true)}
                    className="flex items-center gap-3"
                  >
                    <Search size={12} />
                    Buscar lançamento
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRelaunchEmissionModal(true)}
                    className="flex items-center gap-3"
                  >
                    <Rocket size={12} />
                    Relançar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setEditModal(true)}
                    className="flex items-center gap-3"
                    disabled={!editable}
                  >
                    <Pencil size={12} />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteEmissionAlert(true)}
                    className="flex items-center gap-3 bg-red-200 text-red-600"
                    disabled={!editable}
                  >
                    <Trash2 size={12} />
                    Excluir
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3">
                    <File size={12} />
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </AccordionTrigger>
          <AccordionContent className="mb-0 mt-4 grid w-full grid-cols-auto-md gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                N° Processo:
              </span>
              <span className="text-zinc-500">
                {data?.processNumber.toString().padStart(6, '0')}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Tipo de documento:
              </span>
              <span className="text-zinc-500">{data?.documentType}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                N° Documento:
              </span>
              <span className="text-zinc-500">
                {data?.fiscalNumber.toString().padStart(6, '0')}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Identificação do emitente:
              </span>
              <span className="text-zinc-500">{data?.issue}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Destinatário/Remetente:
              </span>
              <span className="text-zinc-500">{data?.sender}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Data emissão:
              </span>
              <span className="text-zinc-500">
                {dayjs(data?.dateEmission).format('DD/MM/YYYY')}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Data lançamento:
              </span>
              <span className="text-zinc-500">
                {dayjs(data?.dateLaunch).format('DD/MM/YYYY')}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Chave de acesso:
              </span>
              <span className="text-zinc-500">{data?.key}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Observação:
              </span>
              <span className="text-zinc-500">{data?.description}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {data && (
        <EditEmissionModal
          data={data}
          open={editModal}
          onOpenChange={setEditModal}
        />
      )}
      <ProductModal
        mode="create"
        open={createModal}
        onOpenChange={setCreateModal}
      />

      <InstallmentSheet
        open={detailsPaymentSheet}
        onOpenChange={setDetailsPaymentSheet}
      />

      <SearchEmissionModal
        open={searchEmissionModal}
        onOpenChange={setSearchEmissionModal}
      />

      <RelaunchEmissionModal
        open={relaunchEmissionModal}
        onOpenChange={setRelaunchEmissionModal}
      />

      <AlertModal
        open={deleteEmissionAlert}
        onOpenChange={setDeleteEmissionAlert}
        onConfirm={handleDeleteEmission}
      />
    </PageHeader>
  )
}

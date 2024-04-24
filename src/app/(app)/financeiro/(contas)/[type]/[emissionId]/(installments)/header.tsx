'use client'
import { AlertModal } from '@/components/alert-modal'
import { Form } from '@/components/form'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { currencyFormat } from '@/lib/currencyFormat'
import { useEmissionStore } from '@/store/financial/emission'
import { useLoading } from '@/store/loading-store'
import { CheckCircle } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { FormInstallments } from './form-installments'
import { TributesModal } from './tributes-modal'

export function HeaderInstallment() {
  const { installmentsData, totalProducts, canFinalize } = useEmissionStore(
    ({ installmentsData, totalProducts, canFinalize }) => ({
      totalProducts,
      canFinalize,
      installmentsData: {
        ...installmentsData,
        taxation:
          (installmentsData?.totalDiscount || 0) +
          (installmentsData?.totalAddition || 0),
      },
    }),
  )
  const [finalizeModal, setFinalizaModal] = useState(false)
  const params = useParams()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const loading = useLoading()

  console.log(canFinalize)

  async function handleFinalizeEmission() {
    if (totalProducts !== installmentsData.totalGross) {
      toast({
        title:
          'O total de itens adicionados esta diferente do total das parcelas!',
        variant: 'success',
      })
      return
    }

    loading.show()
    const response = await api.get(
      `financial/account/finance/${params.emissionId}/finalize`,
      {
        params: {
          application: `blank_financeiro_emissao_${params.type}`,
        },
      },
    )
    loading.hide()

    if (response.status !== 200) return

    router.push(`../${params.type}?h=hidden&token=${searchParams.get('token')}`)

    toast({
      title: 'Emissão finalizada com sucesso!',
      variant: 'success',
    })
  }

  return (
    <>
      <PageHeader>
        <div className="grid flex-1 grid-cols-auto-sm gap-4">
          <Form.Field>
            <Form.Label>Total</Form.Label>
            <span>{currencyFormat(installmentsData?.totalGross ?? 0)}</span>
          </Form.Field>

          <Form.Field>
            <Form.Label>Taxas:</Form.Label>
            <TributesModal
              emissionId={Number(params.emissionId)}
              totalTributes={installmentsData.taxation}
            />
          </Form.Field>

          <Form.Field>
            <Form.Label>Total liquido:</Form.Label>
            <span>{currencyFormat(installmentsData?.totalLiquid ?? 0)}</span>
          </Form.Field>
        </div>

        <div className="flex gap-3">
          <FormInstallments />
          <Button
            disabled={!canFinalize}
            onClick={() => setFinalizaModal(true)}
            variant="secondary"
          >
            <CheckCircle size={12} />
            Finalizar
          </Button>
        </div>
      </PageHeader>

      <AlertModal
        open={finalizeModal}
        onOpenChange={setFinalizaModal}
        onConfirm={handleFinalizeEmission}
        message="Tem certeza que deseja finalizar ?"
      />
    </>
  )
}

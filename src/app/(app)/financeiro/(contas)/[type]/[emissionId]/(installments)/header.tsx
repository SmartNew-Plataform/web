'use client'
import { Form } from '@/components/form'
import { PageHeader } from '@/components/page-header'
import { currencyFormat } from '@/lib/currencyFormat'
import { useEmissionStore } from '@/store/financial/emission'
import { useParams } from 'next/navigation'
import { FormInstallments } from './form-installments'
import { TributesModal } from './tributes-modal'

export function HeaderInstallment() {
  const { installmentsData } = useEmissionStore(({ installmentsData }) => ({
    installmentsData: {
      ...installmentsData,
      taxation:
        (installmentsData?.totalDiscount || 0) +
        (installmentsData?.totalAddition || 0),
    },
  }))
  const params = useParams()
  return (
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

      <FormInstallments />
    </PageHeader>
  )
}

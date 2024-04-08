'use client'

import { Installment } from '@/@types/finance-emission'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { currencyFormat } from '@/lib/currencyFormat'
import { useEmissionStore } from '@/store/financial/emission'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Pencil } from 'lucide-react'
import { useParams } from 'next/navigation'
import { FormInstallmentEdit } from './form-installmnet-edit'

export function GridInstallment() {
  const {
    fetchInstallmentsData,
    setDataInstallmentEditing,
    dataInstallmentEditing,
  } = useEmissionStore(
    ({
      fetchInstallmentsData,
      setDataInstallmentEditing,
      dataInstallmentEditing,
    }) => ({
      fetchInstallmentsData,
      setDataInstallmentEditing,
      dataInstallmentEditing,
    }),
  )
  const routeParams = useParams()

  const columns: ColumnDef<Installment>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const dueDate = row.getValue('dueDate') as string
        const valuePay = row.getValue('valuePay') as number
        const id = row.getValue('id') as string
        return (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon-xs"
              onClick={() =>
                setDataInstallmentEditing({
                  dueDate,
                  valuePay,
                  id,
                })
              }
            >
              <Pencil size={12} />
            </Button>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'split',
      header: 'parcelas',
    },
    {
      accessorKey: 'dueDate',
      header: 'vencimento',
      cell: (row) => {
        return row.getValue()
          ? dayjs(row.getValue() as string).format('DD/MM/YYYY')
          : ''
      },
    },
    {
      accessorKey: 'prorogation',
      header: 'prorrogação',
      cell: (row) => {
        return row.getValue()
          ? dayjs(row.getValue() as string).format('DD/MM/YYYY')
          : ''
      },
    },
    {
      accessorKey: 'valuePay',
      header: 'valor processo',
      cell: (row) => {
        return currencyFormat(row.getValue() as number)
      },
    },
    {
      accessorKey: 'addition',
      header: 'Acréscimos',
      cell: (row) => {
        return currencyFormat(row.getValue() as number)
      },
    },
    {
      accessorKey: 'discount',
      header: 'descontos',
      cell: (row) => {
        return currencyFormat(row.getValue() as number)
      },
    },
    {
      accessorKey: 'valueSplit',
      header: 'valor parcela',
      cell: (row) => {
        return currencyFormat(row.getValue() as number)
      },
    },
    {
      accessorKey: 'paymentDate',
      header: 'data pagamento',
      cell: (row) => {
        return row.getValue()
          ? dayjs(row.getValue() as string).format('DD/MM/YYYY')
          : ''
      },
    },
  ]

  const { data } = useQuery({
    queryKey: ['finance/account/launch/installments'],
    queryFn: () =>
      fetchInstallmentsData({
        emissionId: routeParams.emissionId as string,
        type: routeParams.type as string,
      }),
  })

  return (
    <>
      <DataTable columns={columns} data={data || []} />
      <FormInstallmentEdit
        open={!!dataInstallmentEditing}
        onOpenChange={(open) =>
          setDataInstallmentEditing(open ? dataInstallmentEditing : undefined)
        }
      />
    </>
  )
}

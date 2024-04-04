import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'

export function GridInstallment() {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: () => {
        return (
          <div className="flex gap-2">
            <Button variant="secondary" size="icon-xs">
              <Pencil size={12} />
            </Button>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: 'parcelas',
    },
    {
      header: 'vencimento',
    },
    {
      header: 'prorrogação',
    },
    {
      header: 'valor processo',
    },
    {
      header: 'Acréscimos',
    },
    {
      header: 'descontos',
    },
    {
      header: 'valor parcela',
    },
    {
      header: 'data pagamento',
    },
  ]

  return <DataTable columns={columns} data={Array.from({ length: 15 })} />
}

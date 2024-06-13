import { FuellingType } from '@/@types/fuelling-fuelling'
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'

export function Table() {
  const columns: ColumnDef<FuellingType>[] = [
    {
      accessorKey: 'id',
      header: '',
    },
    {
      accessorKey: 'tank.label',
      header: 'Tanque',
    },
    {
      accessorKey: 'type',
      header: 'tipo',
    },
    {
      accessorKey: 'driver.label',
      header: 'Motorista',
    },
    {
      accessorKey: 'branch.label',
      header: 'Filial',
    },
    {
      accessorKey: 'postName.label',
      header: 'Nome do posto',
    },
  ]
  return <DataTable columns={columns} data={[]} />
}

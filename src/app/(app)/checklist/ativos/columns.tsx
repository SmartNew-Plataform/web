import { Active } from '@/@types/active'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'

export const columns: ColumnDef<Active>[] = [
  {
    accessorKey: 'id',
    header: '',
    cell: () => {
      return (
        <Button variant="secondary" size="icon-xs">
          <Pencil size={12} />
        </Button>
      )
    },
  },
  {
    accessorKey: 'id',
    header: 'id',
  },
  {
    accessorKey: 'branch.label',
    header: 'cliente',
  },
  {
    accessorKey: 'costCenter.label',
    header: 'centro custo',
  },
  {
    accessorKey: 'equipmentCode',
    header: 'Equipamento código',
  },
  {
    accessorKey: 'description',
    header: 'Descrição tag',
  },
  {
    accessorKey: 'family.label',
    header: 'Familia',
  },
  {
    accessorKey: 'typeEquipment.label',
    header: 'equipamento tipo',
  },
  {
    accessorKey: 'inGuarantee',
    header: 'Em garantia?',
  },
  {
    accessorKey: 'plate',
    header: 'Placa',
  },
  {
    accessorKey: 'chassi',
    header: 'chassi',
  },
  {
    accessorKey: 'serie',
    header: 'n° serie',
  },
  {
    accessorKey: 'status',
    header: 'Status Equipamento',
  },
  {
    accessorKey: 'observation',
    header: 'observação',
  },
]

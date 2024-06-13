'use client'
import { TankType } from '@/@types/fuelling-tank'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'

export function Table() {
  const columns: ColumnDef<TankType>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell({ row }) {
        const id = row.getValue('id')
        console.log(id)

        return (
          <div className="flex gap-2">
            <Button size="icon-xs">
              <Pencil size={12} />
            </Button>
            <Button variant="destructive" size="icon-xs">
              <Trash2 size={12} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'tag',
      header: 'tag',
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
    },
    {
      accessorKey: 'capacity',
      header: 'Capacidade maxima',
    },
    {
      accessorKey: 'branch.label',
      header: 'Filial',
    },
  ]

  return <DataTable columns={columns} data={[]} />
}

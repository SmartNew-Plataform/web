'use client'
import { TankType } from '@/@types/fuelling-tank'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'

export function Table() {
  async function fetchSelects() {
    const response = await api.get('fuelling/list-tank').then((res) => res.data)

    return response.data
  }

  const { data } = useQuery({
    queryKey: ['fuelling/create/data'],
    queryFn: fetchSelects,
  })

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
      accessorKey: 'model',
      header: 'tag',
    },
    {
      accessorKey: 'tank',
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

  return (
    <>
      <DataTable columns={columns} data={data || []} />
    </>
  )
}

'use client'
import { ListFuelling } from '@/@types/fuelling-fuelling'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'

export function Table() {
  async function fetchSelects() {
    const response = await api.get('fuelling/info').then((res) => res.data)
    return response.data
  }

  const { data } = useQuery({
    queryKey: ['fuelling/data'],
    queryFn: fetchSelects,
  })

  const columns: ColumnDef<ListFuelling>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell({ row }) {
        const id = row.getValue('id') as string
        console.log(id)

        return (
          <div className="flex gap-2">
            <Button size="icon-xs">
              <Pencil size={12} />
            </Button>
            <Button variant="destructive" size="icon-xs">
              <Trash2 size={12} />
            </Button>
            <Button variant="outline" size="icon-xs">
              <Plus size={12} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'driver',
      header: 'Motorista',
    },
    {
      accessorKey: 'fuelStation',
      header: 'Nome do Posto',
    },

    {
      accessorKey: 'fiscalNumber',
      header: 'Nota fiscal',
    },
    {
      accessorKey: 'request',
      header: 'Numero requisição',
    },
    {
      accessorKey: 'date',
      header: 'Data abastecimento',
    },
    {
      accessorKey: 'equipment',
      header: 'Equipamento',
    },
    {
      accessorKey: 'type',
      header: 'Tipo consumo',
    },
    {
      accessorKey: 'counter',
      header: 'Contador atual',
    },
    {
      accessorKey: 'previous',
      header: 'Contador anterior',
    },
    {
      accessorKey: 'tankFuelling',
      header: 'Combustivel',
    },
    {
      accessorKey: 'quantidade',
      header: 'Quantidade',
    },
    {
      accessorKey: 'accomplished',
      header: 'Cons Realizado',
    },
    {
      accessorKey: 'unitary',
      header: 'Valor UN',
    },
    {
      accessorKey: 'total',
      header: 'Custo total',
    },
    {
      accessorKey: 'observation',
      header: 'Observações',
    },
  ]
  return <DataTable columns={columns} data={data || []} />
}

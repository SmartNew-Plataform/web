'use client'
import { FuelInlet } from '@/@types/fuelling-tank'
import { DataTable } from '@/components/data-table'
import { ColumnDef } from '@tanstack/react-table'

export function Table() {
  const columns: ColumnDef<FuelInlet>[] = [
    {
      accessorKey: 'id',
      header: '',
    },
    {
      accessorKey: 'equipment',
      header: 'Equipamento',
    },
    {
      accessorKey: 'model',
      header: 'Modelo',
    },
    {
      accessorKey: 'consumption',
      header: 'Tipo Consumo',
    },
    {
      accessorKey: 'predictedconsumption',
      header: 'Consumo Previsto',
    },
    {
      accessorKey: 'realconsumption',
      header: 'Consumo Real',
    },
    {
      accessorKey: 'DIF',
      header: 'DIF(%)',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantidade',
    },
    {
      accessorKey: 'value',
      header: 'Valor',
    },

    {
      accessorKey: 'counterdifference',
      header: 'Diferença Contador',
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={[]} />
    </>
  )
}

'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface FuellingItem {
  equipment: string
  typeConsumption: string
  quantity: number
  total: number
  sumConsumption: number
  expectedConsumption: number
  consumptionMade: number
  difference?: number
}

interface Grupo {
  family: string
  fuelling: FuellingItem[]
}

async function fetchCompartment(): Promise<Grupo[]> {
  const response = await api.get('fuelling/report/family-consumption')
  return response.data.data || []
}

export default function AnaliseConsumoPorFrota() {
  const { data = [] } = useQuery({
    queryKey: ['fuelling/report/family-consumption'],
    queryFn: fetchCompartment,
  })

  const getIconAndColor = (item: FuellingItem) => {
    const { expectedConsumption, consumptionMade } = item

    let isEficiente = false
    if (expectedConsumption > 0 && consumptionMade > 0) {
      const resultado = consumptionMade / expectedConsumption
      isEficiente = resultado >= 1
    }

    return isEficiente
      ? {
          icon: <TrendingUp className="text-green-500" />,
          color: 'text-green-500',
        }
      : {
          icon: <TrendingDown className="text-red-500" />,
          color: 'text-red-500',
        }
  }

  return (
    <div className="container mx-auto p-4">
      {data.map((grupo: Grupo, index: number) => (
        <div key={index} className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">{grupo.family}</h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2">Equipamento</TableHead>
                <TableHead className="px-4 py-2">Tipo Consumo</TableHead>
                <TableHead className="px-4 py-2">Qtd Litros</TableHead>
                <TableHead className="px-4 py-2">Vlr Total</TableHead>
                <TableHead className="px-4 py-2">Total Contador</TableHead>
                <TableHead className="px-4 py-2">Cons. Previsto</TableHead>
                <TableHead className="px-4 py-2">Cons. Realizado</TableHead>
                <TableHead className="px-4 py-2">Diferença %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grupo.fuelling.map((item: FuellingItem, idx: number) => {
                const { icon, color } = getIconAndColor(item)
                return (
                  <TableRow key={idx} className="hover:bg-gray-100">
                    <TableCell className="border px-4 py-2">
                      {item.equipment}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      {item.typeConsumption}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      {item.total}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      {item.sumConsumption}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      {item.expectedConsumption}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      {item.consumptionMade}
                    </TableCell>
                    <TableCell
                      className={`flex items-center gap-2 border px-4 py-2 ${color}`}
                    >
                      {icon}
                      {item.difference?.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  )
}

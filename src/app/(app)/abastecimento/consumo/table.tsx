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
import { useFilterConsuption } from '@/store/fuelling/filter-consuption'
import { useQuery } from '@tanstack/react-query'
import { TrendingDown, TrendingUp } from 'lucide-react'

export interface FuellingItem {
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

export default function AnaliseConsumoPorFrota() {
  const { filters } = useFilterConsuption()

  async function fetchCompartment(): Promise<Grupo[]> {
    const response = await api.get('fuelling/report/family-consumption', {
      params: filters,
    })
    return response.data.data || []
  }

  const { data = [] } = useQuery({
    queryKey: [
      'fuelling/report/family-consumption',
      ...Object.values(filters || {}),
    ],
    queryFn: fetchCompartment,
    refetchInterval: 1 * 20 * 1000,
  })

  const getIconAndColor = (item: FuellingItem) => {
    const { expectedConsumption, consumptionMade, typeConsumption } = item

    if (expectedConsumption === 0 && consumptionMade > 0) {
      if (typeConsumption === 'L/HR') {
        return {
          icon: <TrendingDown className="text-red-500" />,
          color: 'text-red-500',
          percentage: '100.00',
        }
      } else if (typeConsumption === 'KM/L') {
        return {
          icon: <TrendingUp className="text-green-500" />,
          color: 'text-green-500',
          percentage: '100.00',
        }
      }
    }

    if (expectedConsumption <= 0 || consumptionMade <= 0) {
      return {
        icon: null,
        color: '',
        percentage: null,
      }
    }

    const difference =
      ((consumptionMade - expectedConsumption) / expectedConsumption) * 100

    const isEficiente =
      typeConsumption === 'L/HR'
        ? consumptionMade <= expectedConsumption
        : consumptionMade >= expectedConsumption

    const icon = isEficiente ? (
      <TrendingUp className="text-green-500" />
    ) : (
      <TrendingDown className="text-red-500" />
    )

    const color = isEficiente ? 'text-green-500' : 'text-red-500'

    return {
      icon,
      color,
      percentage: difference.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
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
                const { icon, color, percentage } = getIconAndColor(item)
                return (
                  <TableRow key={idx} className="hover:bg-gray-100">
                    <TableCell className="border px-4 py-2">
                      {item.equipment}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      {item.typeConsumption}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      {item.quantity.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      {item.total.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      {item.sumConsumption.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      {item.expectedConsumption.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="border px-4 py-2">
                      {item.consumptionMade.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell
                      className={`flex items-center gap-2 border px-4 py-2 ${color}`}
                    >
                      {icon}
                      {percentage ? `${percentage}%` : '-'}
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

'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Pencil, Trash2 } from 'lucide-react'

const fuelData = [
  { id: '1', name: 'Gasolina', unidade: 'LT' },
  { id: '2', name: 'Diesel', unidade: 'LT' },
  { id: '3', name: 'Etanol', unidade: 'LT' },
  { id: '4', name: 'GNV', unidade: 'LT' },
  { id: '5', name: 'Gasolina', unidade: 'LT' },
  { id: '6', name: 'Diesel', unidade: 'LT' },
  { id: '7', name: 'Etanol', unidade: 'LT' },
  { id: '8', name: 'GNV', unidade: 'LT' },
  { id: '9', name: 'Gasolina', unidade: 'LT' },
  { id: '10', name: 'Diesel', unidade: 'LT' },
  { id: '11', name: 'Etanol', unidade: 'LT' },
  { id: '12', name: 'GNV', unidade: 'LT' },
  { id: '13', name: 'Gasolina', unidade: 'LT' },
  { id: '14', name: 'Diesel', unidade: 'LT' },
  { id: '15', name: 'Etanol', unidade: 'LT' },
  { id: '16', name: 'GNV', unidade: 'LT' },
]

export function FuelList() {
  return (
    <div className="grid max-h-full grid-cols-auto gap-4 overflow-auto">
      {fuelData.map(({ id, name, unidade }) => (
        <Card key={id} className="flex flex-col justify-between p-4">
          <div className="flex gap-2 self-end">
            <Button variant="secondary" size="icon-sm">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon-sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="max-w-full flex-1 truncate">
                {name} - {unidade}
              </span>
            </TooltipTrigger>
            <TooltipContent>{name}</TooltipContent>
          </Tooltip>
        </Card>
      ))}
    </div>
  )
}

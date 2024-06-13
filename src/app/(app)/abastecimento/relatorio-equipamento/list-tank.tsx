'use client'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Tank } from './tank'

interface TankType {
  name: string
  type: 'internal' | 'external'
  maxCapacity: number
  quantity: number
}

interface ListTankType {
  name: string
  tank: TankType[]
}

export function ListTank() {
  const data = Array.from({ length: 5 }).map((_, i) => ({
    name: `Tanque ${i + 1}`,
    tank: Array.from({ length: 8 }).map((_, index) => ({
      name: 'Gasosa',
      type: i % 2 ? 'external' : 'internal',
      maxCapacity: Number(`${index + 1}0`),
      quantity: Number(`${index + 1}0`) / index + 1,
    })),
  })) as ListTankType[]

  console.log(data)

  return (
    <div className="flex max-h-full flex-col gap-4 overflow-auto">
      {data.map(({ name, tank }) => (
        <Card key={name}>
          <CardContent>
            <CardTitle className="pb-6 pt-6">{name}</CardTitle>
            <div className="flex flex-wrap gap-4">
              {tank.map(({ type, name, maxCapacity, quantity }) => (
                <Tank
                  key={name}
                  type={type}
                  fuel={name}
                  fuelLevel={quantity}
                  fuelCapacity={maxCapacity}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

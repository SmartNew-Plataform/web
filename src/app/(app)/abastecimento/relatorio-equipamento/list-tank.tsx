'use client'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
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
  const searchParams = useSearchParams()
  const filter = searchParams.get('s') || undefined
  async function fetchTankList() {
    const response = await api
      .get<{
        data: ListTankType[]
      }>('fuelling/report/control-fuelling', {
        params: { filterText: filter },
      })
      .then((res) => res.data.data)

    return response
  }

  const { data } = useQuery({
    queryKey: ['fuelling-tank-list'],
    queryFn: fetchTankList,
    refetchInterval: 30000,
  })

  // const data = Array.from({ length: 3 }).map((_, i) => ({
  //   name: `Tanque ${i + 1}`,
  //   tank: Array.from({ length: 3 }).map((_, index) => ({
  //     name: 'Gasosa',
  //     type: i % 2 ? 'external' : 'internal',
  //     maxCapacity: Number(`${index + 1}0`),
  //     quantity: Number(`${index + 1}0`) / index + 1,
  //   })),
  // })) as ListTankType[]

  console.log(data)

  return (
    <div className="flex max-h-full flex-col gap-4 overflow-auto">
      {data?.map(({ name, tank }) => (
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

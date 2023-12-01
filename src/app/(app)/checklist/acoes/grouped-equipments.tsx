'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import dayjs from 'dayjs'
import { ItemData } from './sheet-action'

interface GroupedEquipmentsProps {
  data: Array<ItemData>
}

export function GroupedEquipments({ data }: GroupedEquipmentsProps) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-auto">
      {data.map(({ branch, equipment, id, task, startDate }) => {
        return (
          <Card key={id}>
            <CardHeader>
              <CardTitle className="text-lg text-slate-700">
                {equipment}
              </CardTitle>
              <CardDescription>
                {dayjs(startDate).format('DD/MM/YYYY HH:mm:ss')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <span>{task}</span>
              <Separator orientation="horizontal" />
              <span className="text-slate-600">{branch}</span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

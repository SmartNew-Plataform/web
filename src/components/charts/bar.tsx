'use client'
import { useDashboardChecklistStore } from '@/store/dashboard-checklist-store'
import { Wind } from 'lucide-react'
import Chart, { Props } from 'react-apexcharts'

export const dynamic = 'force-dynamic'

export function Bar() {
  const { family } = useDashboardChecklistStore()

  const dataApex: Props = {
    series: [
      {
        data: Object.values(family || {}),
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: Object.keys(family || {}),
      },
    },
  }

  if (!family) {
    return (
      <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-4">
        <div className="aspect-square rounded-full bg-violet-200 p-4 text-violet-500">
          <Wind className="h-8 w-8" />
        </div>
        <span className="text-slate-600">Nenhum resultado encontrado.</span>
      </div>
    )
  }

  return (
    <Chart options={dataApex.options} series={dataApex.series} type="bar" />
  )
}

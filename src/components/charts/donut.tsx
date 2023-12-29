'use client'
import { useDashboardChecklistStore } from '@/store/dashboard-checklist-store'
import { Wind } from 'lucide-react'
import Chart, { Props } from 'react-apexcharts'

export const dynamic = 'force-dynamic'

export function Donut() {
  const { status } = useDashboardChecklistStore()

  const dataApex: Props = {
    series: Object.values(status || {}),
    options: {
      chart: {
        type: 'donut',
      },
      xaxis: {
        categories: Object.keys(status || {}),
      },
      legend: {
        customLegendItems: Object.keys(status || {}),
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  }

  if (!status) {
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
    <Chart options={dataApex.options} series={dataApex.series} type="donut" />
  )
}

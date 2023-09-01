'use client'
import { useDashboardChecklistStore } from '@/store/dashboard-checklist-store'
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

  return (
    <Chart options={dataApex.options} series={dataApex.series} type="bar" />
  )
}

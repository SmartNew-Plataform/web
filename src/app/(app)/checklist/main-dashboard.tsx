'use client'

import { CardStatus } from '@/components/CardStatus'
import { Bar } from '@/components/Charts/Bar'
import { Donut } from '@/components/Charts/Donut'
import { LoadingPage } from '@/components/LoadingPage'
import { Card, CardContent } from '@/components/ui/card'
import { useDashboardChecklistStore } from '@/store/dashboard-checklist-store'

export function MainDashboard() {
  const { summaryCards, loadingDashboard } = useDashboardChecklistStore()
  return (
    <>
      {loadingDashboard ? (
        <LoadingPage message="Carregando dados do dashboard..." />
      ) : (
        <main className="flex flex-1 flex-col gap-5">
          <div className="grid grid-cols-auto gap-4">
            {summaryCards?.map(({ color, description, icon, id, quantity }) => {
              return (
                <CardStatus
                  key={id}
                  icon={icon}
                  label={description}
                  quantity={quantity}
                  color={color}
                />
              )
            })}
          </div>

          <div className="grid grid-cols-auto gap-4">
            <Card>
              <CardContent>
                <Bar />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Donut />
              </CardContent>
            </Card>
          </div>
        </main>
      )}
    </>
  )
}

'use client'

import { CardStatus } from '@/components/card-status'
import { Bar } from '@/components/charts/bar'
import { Donut } from '@/components/charts/donut'
import { LoadingPage } from '@/components/loading-page'
import { Card, CardContent } from '@/components/ui/card'
import { useDashboardChecklistStore } from '@/store/dashboard-checklist-store'

export function MainDashboard() {
  const { summaryCards, loadingDashboard } = useDashboardChecklistStore()
  return (
    <>
      {loadingDashboard ? (
        <LoadingPage message="Carregando dados do dashboard...Isso pode demorar alguns minutos!" />
      ) : (
        <main className="flex h-full flex-col gap-5 pb-4">
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

          <div className="grid h-full flex-1 grid-cols-auto gap-4">
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

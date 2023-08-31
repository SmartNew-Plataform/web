import { HeaderDashboard } from './header-dashboard'
import { MainDashboard } from './main-dashboard'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = true

export default function ChecklistPage() {
  return (
    <div className="flex h-full w-full flex-col gap-4 bg-zinc-50 p-4">
      <HeaderDashboard />

      <MainDashboard />
    </div>
  )
}

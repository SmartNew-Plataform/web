import { HeaderDashboard } from '@/components/header-dashboard'
import { MainDashboard } from '@/components/main-dashboard'

export default function ChecklistPage() {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 pt-0">
      <HeaderDashboard />
      <MainDashboard />
    </div>
  )
}

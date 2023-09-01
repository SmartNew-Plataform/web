import { HeaderChecklist } from '@/components/header-checklist'
import { NavigationBar } from '@/components/navigation-bar'

export default function LayoutChecklist({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <HeaderChecklist />
      <NavigationBar />
      <div className="flex h-full flex-col overflow-auto">{children}</div>
    </div>
  )
}

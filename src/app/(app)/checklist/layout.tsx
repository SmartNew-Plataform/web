import { NavigationBar } from '@/components/navigation-bar'
import { HeaderChecklist } from './header-checklist'

export default function LayoutChecklist({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col pb-4">
      <HeaderChecklist />
      <NavigationBar />
      <div className="flex h-full flex-col overflow-auto">{children}</div>
    </div>
  )
}

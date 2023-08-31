import { HeaderChecklist } from './header-checklist'

export default function LayoutChecklist({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <HeaderChecklist />
      <div className="flex h-full flex-col overflow-auto">{children}</div>
    </div>
  )
}

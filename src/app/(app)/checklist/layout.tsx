import { HeaderChecklist } from './header-checklist'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = true

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

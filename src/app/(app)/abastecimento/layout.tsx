import { HeaderFuelling } from './header-fuelling'

export default function LayoutFuelling({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col pb-4">
      <HeaderFuelling />
      {/* <NavigationBar /> */}
      <div className="flex h-full flex-col overflow-auto">{children}</div>
    </div>
  )
}

import { HeaderInfo } from '@/components/header-info'
import { TableInfo } from '@/components/table-info'

// export const dynamic = 'force-dynamic'
// export const dynamicParams = true
// export const revalidate = true

export default function Info() {
  return (
    <div className="flex max-h-full flex-col gap-4 p-4 pt-0">
      <HeaderInfo />
      <TableInfo />
    </div>
  )
}
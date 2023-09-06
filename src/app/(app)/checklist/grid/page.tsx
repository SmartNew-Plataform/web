import { HeaderInfo } from '@/components/header-info'
import { TableInfo } from '@/components/table-info'

export default function Info() {
  return (
    <div className="flex max-h-full flex-col gap-4 p-4 pt-0">
      <HeaderInfo />
      <TableInfo />
    </div>
  )
}

'use client'
import { PageHeader } from '@/components/page-header'
import { Input } from '@/components/ui/input'
import { useBoundStore } from '@/store/smartlist/smartlist-bound'
import { SheetNewBound } from './sheet-new-bound'

export function Header() {
  const { setFilterText, filterText } = useBoundStore()
  return (
    <PageHeader className="flex justify-between p-4">
      <Input
        className="max-w-xs"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <SheetNewBound />
    </PageHeader>
  )
}

'use client'
import { PageHeader } from '@/components/page-header'
import { Input } from '@/components/ui/input'
import { useBoundStore } from '@/store/smartlist/smartlist-bound'
import { SheetNewBound } from './sheet-new-bound'
import { SearchInput } from '@/components/search-input'

export function Header() {
  const { setFilterText, filterText } = useBoundStore()
  return (
    <PageHeader className="flex justify-between p-4">
      <SearchInput />
      <SheetNewBound />
    </PageHeader>
  )
}

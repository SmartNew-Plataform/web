'use client'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'
import { SheetNewBound } from './sheet-new-bound'

export function Header() {
  return (
    <PageHeader className="flex justify-between p-4">
      <SearchInput />
      <SheetNewBound />
    </PageHeader>
  )
}

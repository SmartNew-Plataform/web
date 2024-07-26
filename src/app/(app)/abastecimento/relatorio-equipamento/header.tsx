import { HeaderFilter } from '@/components/header-filter'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'

export function Header() {
  return (
    <PageHeader>
      <h1 className="text-xl font-semibold text-slate-600">
        Relatório de equipamento
      </h1>
      <div className="flex gap-4">
        <HeaderFilter />
        <SearchInput />
      </div>
    </PageHeader>
  )
}

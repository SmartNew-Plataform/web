'use client'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <PageHeader>
      <h1 className="text-xl font-semibold text-slate-600">
        Cadastro de produto
      </h1>
      <div className="flex gap-4">
        <SearchInput />
        <Button>
          <Plus size={16} />
          Cadastrar Produto
        </Button>
      </div>
    </PageHeader>
  )
}

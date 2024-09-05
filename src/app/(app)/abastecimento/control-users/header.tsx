'use client'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ProductModal } from './Primary-modal'

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <PageHeader>
      <h1 className="text-xl font-semibold text-slate-600">
        Cadastro de usuário
      </h1>
      <div className="flex gap-4">
        <SearchInput />
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          Vincular usuário
        </Button>
      </div>

      <ProductModal
        mode="create"
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </PageHeader>
  )
}

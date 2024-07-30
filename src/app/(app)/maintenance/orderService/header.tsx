'use client'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ServiceOrderForm } from './service-order-form'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  // async function handleCreateActive(data: ActiveFormData) {
  //   console.log('Form submitted', data)
  // }

  return (
    <>
      <PageHeader>
        <h1 className="text-xl font-semibold text-slate-600">
          Ordem de Serviço
        </h1>

        <div className="flex gap-4">
          <SearchInput />
          <Button onClick={() => setIsOpen(true)}>
            <Plus size={16} />
            Criar
          </Button>
        </div>
      </PageHeader>
      <ServiceOrderForm
        open={isOpen}
        onOpenChange={setIsOpen}
        data={[]}
        // onSubmit={handleCreateActive}
      />
    </>
  )
}

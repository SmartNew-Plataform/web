'use client'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { TankModal } from './inlet-modal'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <PageHeader>
      <h1 className="text-xl font-semibold text-slate-600">
        Registrar entrada
      </h1>
      <div className="flex gap-4">
        <SearchInput />
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          nova entrada
        </Button>
      </div>
      <TankModal mode="create" open={open} onOpenChange={setOpen} />
    </PageHeader>
  )
}

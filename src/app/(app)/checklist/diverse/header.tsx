'use client'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { DiverseModal } from './diverse-modal'

export function Header() {
  const [open, setOpen] = useState(false)
  return (
    <PageHeader>
      <h2 className="text-lg font-bold text-slate-600">Cadastro de diversos</h2>

      <Button onClick={() => setOpen(true)}>
        <Plus size={16} />
        Novo diverso
      </Button>

      <DiverseModal mode="create" open={open} onOpenChange={setOpen} />
    </PageHeader>
  )
}

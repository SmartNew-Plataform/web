'use client'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { FuelForm } from './fuelForm'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <PageHeader>
      <h2 className="text-xl font-semibold text-slate-600">
        Registrar abastecimento
      </h2>
      <Button onClick={() => setIsOpen(true)}>
        <Plus size={16} />
        Novo abastecimento
      </Button>
      <FuelForm open={isOpen} onOpenChange={setIsOpen} mode="create" />
    </PageHeader>
  )
}

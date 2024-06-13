import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function Header() {
  return (
    <PageHeader>
      <h2 className="text-xl font-semibold text-slate-600">
        Registrar abastecimento
      </h2>

      <Button>
        <Plus size={16} />
        Novo abastecimento
      </Button>
    </PageHeader>
  )
}

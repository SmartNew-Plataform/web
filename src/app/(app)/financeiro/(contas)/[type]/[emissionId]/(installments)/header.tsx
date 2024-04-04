import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Pencil, Save } from 'lucide-react'

export function HeaderInstallment() {
  return (
    <PageHeader>
      <div className="flex items-center gap-4">
        <Button variant="secondary">
          <ChevronLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold text-zinc-700">
          Detalhes do Pagamento
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <Button>
          <Save size={16} />
          Salvar
        </Button>
        <Button variant="secondary">
          <Pencil size={16} />
          Editar
        </Button>
      </div>
    </PageHeader>
  )
}

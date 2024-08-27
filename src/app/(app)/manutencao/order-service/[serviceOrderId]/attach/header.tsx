import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Paperclip } from 'lucide-react'
import { AttachDialog } from './attach-dialog'

export function Header() {
  return (
    <PageHeader>
      <h2 className="text-xl font-bold text-slate-700">Anexos</h2>

      <AttachDialog>
        <Button>
          <Paperclip size={16} />
          Adicionar anexo
        </Button>
      </AttachDialog>
    </PageHeader>
  )
}

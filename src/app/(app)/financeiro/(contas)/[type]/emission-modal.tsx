import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Wallet2 } from 'lucide-react'

export function EmissionModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Wallet2 width={16} />
          Controle emissão
        </Button>
      </DialogTrigger>

      <DialogContent>
        <h2>Emissao</h2>
      </DialogContent>
    </Dialog>
  )
}

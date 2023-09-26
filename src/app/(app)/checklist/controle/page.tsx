import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

export default function ControlePage() {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 pt-0">
      <Card className="flex justify-between p-4">
        <Input className="max-w-xs" placeholder="Digite para pesquisar..." />

        <Button>
          <Plus className="h-4 w-4" />
          Novo controle
        </Button>
      </Card>
    </div>
  )
}

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { GridControl } from './grid-control'
import { SheetNewControl } from './sheet-new-control'

export default function ControlePage() {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 pt-0">
      <Card className="flex justify-between p-4">
        <Input className="max-w-xs" placeholder="Digite para pesquisar..." />

        <SheetNewControl />
      </Card>

      <GridControl />
    </div>
  )
}

import { PageWrapper } from '@/components/page-wrapper'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { GridControl } from './grid-control'
import { SheetNewControl } from './sheet-new-control'

export default function ControlePage() {
  return (
    <PageWrapper>
      <Card className="flex justify-between p-4">
        <Input className="max-w-xs" placeholder="Digite para pesquisar..." />

        <SheetNewControl />
      </Card>

      <GridControl />
    </PageWrapper>
  )
}

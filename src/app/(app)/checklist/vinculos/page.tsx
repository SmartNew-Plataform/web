import { PageWrapper } from '@/components/page-wrapper'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SheetNewBound } from './sheet-new-bound'
import { TableBounds } from './table-bounds'

export default function VinculosPage() {
  return (
    <PageWrapper>
      <Card className="flex justify-between p-4">
        <Input className="max-w-xs" />
        <SheetNewBound />
      </Card>

      <TableBounds />
    </PageWrapper>
  )
}

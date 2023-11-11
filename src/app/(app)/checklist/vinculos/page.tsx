import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SheetNewBound } from './sheet-new-bound'
import { TableBounds } from './table-bounds'

export default function VinculosPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4 pt-0">
      <Card className="flex justify-between p-4">
        <Input className="max-w-xs" />
        <SheetNewBound />
      </Card>

      <TableBounds />
    </div>
  )
}

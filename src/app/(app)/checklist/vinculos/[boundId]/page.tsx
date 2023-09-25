import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SheetNewTask } from './sheet-new-task'
import { TableTasksBounded } from './table-tasks-bounded'

export default function TasksBoundedPage({
  params,
}: {
  params: { boundId: string }
}) {
  return (
    <div className="flex h-full flex-col gap-4 p-4 pt-0">
      <Card className="flex justify-between p-4">
        <Input className="max-w-xs" />

        <SheetNewTask boundId={params.boundId} />
      </Card>

      <TableTasksBounded boundId={params.boundId} />
    </div>
  )
}

import { PageWrapper } from '@/components/page-wrapper'
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
    <PageWrapper>
      <Card className="flex justify-between p-4">
        <Input className="max-w-xs" />

        <SheetNewTask boundId={params.boundId} />
      </Card>

      <TableTasksBounded boundId={params.boundId} />
    </PageWrapper>
  )
}

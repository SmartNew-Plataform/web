import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'

export function ListSubTasks() {
  return (
    <Card className="p-4">
      <div className="flex w-full items-center justify-between">
        <strong className="text-xl text-slate-600">Nova tarefa</strong>

        <Button variant="destructive" size="icon-sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}

'use client'
import { Card } from '@/components/ui/card'
import { SheetEditTask } from './ sheet-edit-task'
import { GridSubtasks } from './grid-subtasks'

interface TaskpageProps {
  params: {
    taskId: string
  }
}

export default function TaskPage({ params }: TaskpageProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Card className="flex items-center justify-between p-4">
        <div className="flex flex-col justify-start">
          <h1 className="text-2xl font-bold text-slate-700">Titulo da task</h1>
          <span className="max-w-min rounded bg-slate-200 px-2 py-1 uppercase text-slate-600">
            aberto
          </span>
        </div>

        <SheetEditTask />
      </Card>

      <GridSubtasks taskId={params.taskId} />
    </div>
  )
}

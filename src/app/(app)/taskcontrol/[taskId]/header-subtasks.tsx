'use client'
import { Card } from '@/components/ui/card'
import { SheetEditTask } from './ sheet-edit-task'
import { useTaskControlStore } from '@/store/taskcontrol/taskcontrol-store'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export function HeaderSubtasks() {
  const { searchTask, currentTask } = useTaskControlStore(
    ({ searchTask, currentTask }) => ({ searchTask, currentTask }),
  )
  const params = useParams()

  useEffect(() => {
    searchTask(params?.taskId)
  }, [])

  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex flex-col justify-start">
        <h1 className="text-2xl font-bold text-slate-700">
          {currentTask?.description}
        </h1>
        <span className="max-w-min rounded bg-slate-200 px-2 py-1 uppercase text-slate-600">
          aberto
        </span>
      </div>

      <SheetEditTask />
    </Card>
  )
}

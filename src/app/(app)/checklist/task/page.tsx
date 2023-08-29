'use client'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'
import { FormNewTask } from './FormNewTask'
import { Task } from './Task'

export type TaskData = {
  id: string
  description: string
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = true

export default function TaskPage() {
  const [tasks, setTasks] = useState<Array<TaskData>>([])

  async function loadTasks() {
    const response = await api.get('task').then((res) => res.data)
    setTasks(response)
  }

  useEffect(() => {
    loadTasks()
  }, [])

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <Card className="flex justify-between p-4">
        <Input className="max-w-xs" />

        <FormNewTask setTasks={setTasks} />
      </Card>

      <div className="grid max-h-full grid-cols-auto gap-4 overflow-auto">
        {tasks.map(({ id, description }) => (
          <Task
            key={id}
            id={id}
            loadTasks={loadTasks}
            description={description}
          />
        ))}
      </div>
    </div>
  )
}

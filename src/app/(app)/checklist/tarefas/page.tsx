'use client'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useTasksStore } from '@/store/smartlist/smartlist-task'
import { useEffect } from 'react'
import { FormNewTask } from './form-new-task'
import { Task } from './task'

export default function TaskPage() {
  const { loadTasks, tasks, loadStatus, loadTypes, filterTasks } =
    useTasksStore()

  useEffect(() => {
    loadTasks()
    loadStatus()
    loadTypes()
  }, [])

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 pt-0">
      <Card className="flex justify-between p-4">
        <Input
          className="max-w-xs"
          onChange={(e) => filterTasks(e.target.value)}
        />

        <FormNewTask />
      </Card>

      <div className="grid max-h-full grid-cols-auto gap-4 overflow-auto">
        {tasks?.map(({ id, description }) => (
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

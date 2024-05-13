'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useTasksStore } from '@/store/smartlist/smartlist-task'
import { FormNewTask } from './form-new-task'

export function Header() {
  const { filterTasks } = useTasksStore()

  return (
    <Card className="flex justify-between p-4">
      <Input
        className="max-w-xs"
        onChange={(e) => filterTasks(e.target.value)}
      />

      <FormNewTask />
    </Card>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useTasksStore } from '@/store/smartlist/smartlist-task'
import { FormNewTask } from './form-new-task'
import { SearchInput } from '@/components/search-input'

export function Header() {
  const { filterTasks } = useTasksStore()

  return (
    <Card className="flex justify-between p-4">
      <SearchInput />
      <FormNewTask />
    </Card>
  )
}

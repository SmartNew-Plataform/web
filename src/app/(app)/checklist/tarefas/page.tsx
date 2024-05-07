'use client'
import { PageWrapper } from '@/components/page-wrapper'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useTasksStore } from '@/store/smartlist/smartlist-task'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { FormNewTask } from './form-new-task'
import { Task } from './task'

export default function TaskPage() {
  const { loadTasks, loadStatus, loadTypes, filterTasks } = useTasksStore()

  useEffect(() => {
    loadStatus()
    loadTypes()
  }, [])

  const { data } = useQuery({
    queryKey: ['checklist-task'],
    queryFn: loadTasks,
  })

  return (
    <PageWrapper>
      <Card className="flex justify-between p-4">
        <Input
          className="max-w-xs"
          onChange={(e) => filterTasks(e.target.value)}
        />

        <FormNewTask />
      </Card>

      <div className="grid max-h-full grid-cols-auto gap-4 overflow-auto">
        {data?.map(({ id, description }) => (
          <Task key={id} id={id} description={description} />
        ))}
      </div>
    </PageWrapper>
  )
}

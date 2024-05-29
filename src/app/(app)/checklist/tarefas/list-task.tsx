'use client'
import { useTasksStore } from '@/store/smartlist/smartlist-task'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { Task } from './task'

export function ListTask() {
  const { loadTasks } = useTasksStore()
  const searchParams = useSearchParams()
  const filterText = searchParams.get('s') || ''

  const { data } = useQuery({
    queryKey: ['checklist-task', filterText],
    queryFn: () => loadTasks(filterText),
  })

  return (
    <div className="grid max-h-full grid-cols-auto gap-4 overflow-auto">
      {data?.map(({ id, description }) => (
        <Task key={id} id={id} description={description} />
      ))}
    </div>
  )
}

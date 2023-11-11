'use client'

import { GridSubtasks } from './grid-subtasks'
import { HeaderSubtasks } from './header-subtasks'

interface TaskpageProps {
  params: {
    taskId: string
  }
}

export default function TaskPage({ params }: TaskpageProps) {
  return (
    <div className="flex h-full flex-col gap-4 p-4 pt-0">
      <HeaderSubtasks />

      <GridSubtasks />
    </div>
  )
}

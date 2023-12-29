'use client'

import { PageWrapper } from '@/components/page-wrapper'
import { GridSubtasks } from './grid-subtasks'
import { HeaderSubtasks } from './header-subtasks'

interface TaskpageProps {
  params: {
    taskId: string
  }
}

export default function TaskPage({ params }: TaskpageProps) {
  return (
    <PageWrapper>
      <HeaderSubtasks />

      <GridSubtasks />
    </PageWrapper>
  )
}

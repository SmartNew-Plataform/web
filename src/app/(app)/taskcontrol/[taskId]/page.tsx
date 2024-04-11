'use client'

import { PageWrapper } from '@/components/page-wrapper'
import { GridSubtasks } from './grid-subtasks'
import { HeaderSubtasks } from './header-subtasks'

interface TaskPageProps {
  params: {
    taskId: string
  }
}

export default function TaskPage({ params }: TaskPageProps) {
  console.log(params)

  return (
    <PageWrapper>
      <HeaderSubtasks />

      <GridSubtasks />
    </PageWrapper>
  )
}

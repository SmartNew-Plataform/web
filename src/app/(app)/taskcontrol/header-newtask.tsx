'use client'
import { Card } from '@/components/ui/card'
import { SheetNewTaskControl } from './sheet-new-taskcontrol'

export function HeaderNewTask() {
  return (
    <Card className="flex items-center justify-between gap-3 p-4">
      <h1 className="hidden bg-gradient-to-r from-violet-500 to-violet-600 bg-clip-text font-extrabold text-transparent sm:inline sm:text-lg md:text-2xl">
        Task Control
      </h1>

      <SheetNewTaskControl />
    </Card>
  )
}

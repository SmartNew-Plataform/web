import { HeaderNewTask } from './header-newtask'
import { ListSubTasks } from './list-subtasks'

export default function TaskControlPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <HeaderNewTask />
      <ListSubTasks />
    </div>
  )
}

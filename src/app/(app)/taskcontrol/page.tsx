import { HeaderNewTask } from './header-newtask'
import { GridTaskControl } from './grid-taskcontrol'

export default function TaskControlPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <HeaderNewTask />
      <GridTaskControl />
    </div>
  )
}

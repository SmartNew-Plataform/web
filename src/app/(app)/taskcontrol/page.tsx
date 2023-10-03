import { GridTaskControl } from './grid-taskcontrol'
import { HeaderNewTask } from './header-newtask'

export default function TaskControlPage() {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4 pt-0">
      <HeaderNewTask />
      <GridTaskControl />
    </div>
  )
}

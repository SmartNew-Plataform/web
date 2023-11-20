import { SubtaskData } from '@/app/(app)/taskcontrol/[taskId]/grid-subtasks'
import { TaskControlData as GridData } from '@/app/(app)/taskcontrol/grid-taskcontrol'
import { taskcontrolApi } from '@/lib/taskcontrol-api'
import { create } from 'zustand'

// type TaskType = {}

interface TaskControlData {
  tasks: GridData[] | undefined
  currentTask:
    | {
        id: number
        description: string
        company: {
          id: number
          companyName: string
          tradeName: string
        }
        branch: {
          id: number
          companyName: string
          tradeName: string
        }
        status: {
          id: number
          description: string
          color: string
        }
        subtasks: SubtaskData[]
      }
    | undefined
  taskLoading: boolean
  currentTaskLoading: boolean

  autoLogin: () => Promise<void>
  loadTasks: () => Promise<void>
  searchTask: (taskId: number) => Promise<void>
}

export const useTaskControlStore = create<TaskControlData>((set, get) => {
  return {
    tasks: undefined,
    currentTask: undefined,
    taskLoading: false,
    currentTaskLoading: false,

    autoLogin: async () => {
      set({ taskLoading: true })
      const response = await taskcontrolApi
        .post('/signin', {
          login: 'admin',
          moduleId: 1,
        })
        .then((res) => res.headers)
      set({ taskLoading: false })

      const token = response.authorization
      taskcontrolApi.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    loadTasks: async () => {
      set({ taskLoading: true })
      const response = await taskcontrolApi
        .get('/tasks')
        .then((res) => res.data)

      set({
        tasks: response.tasks,
        taskLoading: false,
      })
    },
    searchTask: async (taskId) => {
      set({ currentTaskLoading: true })
      const task = get().tasks?.find(({ id }) => id === taskId)
      const response = await taskcontrolApi
        .get(`/v1/tasks/${taskId}/subtasks`)
        .then((res) => res.data)

      set({ currentTaskLoading: false })
      if (!task) return

      set({
        currentTask: {
          ...task,
          subtasks: response.subtasks,
        },
      })
    },
  }
})

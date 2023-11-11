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
        subtasks: {
          id: number
          moduleId: number
          taskId: number
          statusId: number
          typeId: number
          title: string
          description: string
          adminStatus: number
          deadlineDate: string
          executionDeadlineDate: string
          rescheduledDate: string
          completionDate: string
          users: {
            login: string
            name: string
          }[]
        }[]
      }
    | undefined

  autoLogin: () => Promise<void>
  loadTasks: () => Promise<void>
  searchTask: (taskId: number) => Promise<void>
}

export const useTaskControlStore = create<TaskControlData>((set, get) => {
  return {
    tasks: undefined,
    currentTask: undefined,

    autoLogin: async () => {
      const response = await taskcontrolApi
        .post('/signin', {
          login: 'admin',
          moduleId: 1,
        })
        .then((res) => res.headers)

      const token = response.authorization
      taskcontrolApi.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    loadTasks: async () => {
      const response = await taskcontrolApi
        .get('/tasks')
        .then((res) => res.data)

      set({ tasks: response.tasks })
    },
    searchTask: async (taskId) => {
      const task = get().tasks?.find(({ id }) => id === taskId)
      const response = await taskcontrolApi
        .get(`/v1/tasks/${taskId}/subtasks`)
        .then((res) => res.data)

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

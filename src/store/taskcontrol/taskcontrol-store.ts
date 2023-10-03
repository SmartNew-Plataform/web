import { TaskControlData as GridData } from '@/app/(app)/taskcontrol/grid-taskcontrol'
import { taskcontrolApi } from '@/lib/taskcontrol-api'
import { create } from 'zustand'

// type TaskType = {}

interface TaskControlData {
  tasks: GridData[] | undefined

  autoLogin: () => Promise<void>
  loadTasks: () => Promise<void>
}

export const useTaskControlStore = create<TaskControlData>((set) => {
  return {
    tasks: undefined,

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
  }
})

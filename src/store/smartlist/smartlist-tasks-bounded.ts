import { api } from '@/lib/api'
import { create } from 'zustand'

interface TaskBoundedType {
  id: number
  control: string
  description: string
}

interface Task {
  description: string
  id: number
}

interface Control {
  id: number
  description: string
}

interface StoreData {
  tasksBounded: TaskBoundedType[] | undefined
  task: Task[] | undefined
  control: Control[] | undefined

  loadTasksBounded: (boundId: string) => Promise<void>
  loadTasks: () => Promise<void>
  loadControl: () => Promise<void>
}

export const useTasksBoundedStore = create<StoreData>((set) => {
  return {
    tasksBounded: undefined,
    task: undefined,
    control: undefined,

    async loadTasksBounded(boundId) {
      set({ tasksBounded: undefined })
      const response = await api
        .get(`/smart-list/bound/${boundId}`)
        .then((res) => res.data)

      set({
        tasksBounded: response.list,
      })
    },

    async loadTasks() {
      const response = await api.get('/smart-list/task').then((res) => res.data)

      set({
        task: response.task,
      })
    },

    async loadControl() {
      const response = await api
        .get('/smart-list/bound/list-control')
        .then((res) => res.data)

      set({
        control: response.control,
      })
    },
  }
})

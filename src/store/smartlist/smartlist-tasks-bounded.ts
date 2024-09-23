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

  loadTasksBounded: (parms: {
    boundId: string
    filterText: string
  }) => Promise<void>
  loadTasks: () => Promise<void>
  loadControl: () => Promise<void>
}

export const useTasksBoundedStore = create<StoreData>((set) => {
  return {
    tasksBounded: undefined,
    task: undefined,
    control: undefined,

    async loadTasksBounded({ boundId, filterText }) {
      set({ tasksBounded: undefined })
      const response = await api
        .get(`/smart-list/bound/${boundId}/item`, {
          params: { filterText },
        })
        .then((res) => res.data)

      set({
        tasksBounded: response.data,
      })
      console.log(response)

      return response.list
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

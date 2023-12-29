import { api } from '@/lib/api'
import { create } from 'zustand'

type TaskType = {
  id: string
  description: string
}

type StatusType = {
  description: string
  id: number
  type: string
}

type Types = {
  description: string
  id: number
}

interface StoreData {
  allTasks: TaskType[] | undefined
  tasks: TaskType[] | undefined
  status: StatusType[] | undefined
  types: Types[] | undefined

  loadTasks: () => Promise<void>
  loadStatus: () => Promise<void>
  loadTypes: () => Promise<void>
  filterTasks: (text: string) => void
}

export const useTasksStore = create<StoreData>((set, get) => {
  return {
    allTasks: undefined,
    tasks: undefined,
    status: undefined,
    types: undefined,

    async loadTasks() {
      set({ tasks: undefined })
      const response = await api.get('/smart-list/task').then((res) => res.data)

      set({ tasks: response.task, allTasks: response.task })
    },

    async loadStatus() {
      set({ status: undefined })
      const response = await api
        .get('/smart-list/check-list/list-status')
        .then((res) => res.data)

      set({
        status: response.status,
      })
    },

    async loadTypes() {
      set({ types: undefined })
      const response = await api
        .get('/smart-list/bound/list-control')
        .then((res) => res.data)

      set({ types: response.control })
    },

    filterTasks(text) {
      const tasks = get().allTasks
      const tasksFiltered = tasks?.filter(({ description }) => {
        return description
          .toLocaleLowerCase()
          .trim()
          .includes(text.toLocaleLowerCase().trim())
      })

      set({
        tasks: tasksFiltered,
      })
    },
  }
})

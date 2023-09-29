import { api } from '@/lib/api'
import { create } from 'zustand'

// type TaskType = {}

interface TaskControlData {
  tasks: undefined

  loadTasks: () => Promise<void>
}

export const useTaskControlStore = create<TaskControlData>(() => {
  return {
    tasks: undefined,

    loadTasks: async () => {
      const response = await api
        .post('http://localhost:3000/v1/signin', {
          login: 'admin',
          password: 'Yjp042008',
          moduleId: 1,
        })
        .then((res) => res.headers)

      console.log(response)
    },
  }
})

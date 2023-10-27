import { SubtaskData as GridData } from '@/app/(app)/taskcontrol/[taskId]/grid-subtasks'
import { taskcontrolApi } from '@/lib/taskcontrol-api'
import { create } from 'zustand'

interface SubtaskData {
  subtasks: GridData[] | undefined

  loadSubtasks: ({ taskId }: { taskId: string }) => Promise<void>
}

export const useSubtaskStore = create<SubtaskData>((set) => {
  return {
    subtasks: undefined,

    loadSubtasks: async ({ taskId }) => {
      const response = await taskcontrolApi
        .get(`/tasks/${taskId}/subtasks`)
        .then((res) => res.data)

      set({ subtasks: response.subtasks })
    },
  }
})

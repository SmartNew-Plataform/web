import { SelectData } from '@/@types/select-data'
import { StatusType, TaskType, Types } from '@/@types/smartlist-tasks'
import { api } from '@/lib/api'
import { create } from 'zustand'

interface StoreData {
  allTasks: TaskType[] | undefined
  tasks: TaskType[] | undefined
  status: StatusType[] | undefined
  types: Types[] | undefined

  loadTasks: (filterText:string) => Promise<TaskType[] | undefined>
  loadSelects: () => Promise<{ status: SelectData[]; types: SelectData[] }>
  filterTasks: (text: string) => void
}

export const useTasksStore = create<StoreData>((set, get) => {
  return {
    allTasks: undefined,
    tasks: undefined,
    status: undefined,
    types: undefined,

    async loadTasks(filterText) {
      set({ tasks: undefined })
      const response = await api.get('/smart-list/task', {params:{filterText}}).then((res) => res.data)

      set({ tasks: response.task, allTasks: response.task })
      return response.task
    },

    async loadSelects() {
      const responseStatus = await api
        .get<{ status: StatusType[] }>('/smart-list/check-list/list-status')
        .then((res) => res.data)

      const responseControl = await api
        .get<{ control: Types[] }>('/smart-list/bound/list-control')
        .then((res) => res.data)

      const status = responseStatus.status
      const types = responseControl.control

      set({
        status: responseStatus.status,
        types: responseControl.control,
      })

      const statusFormatted = status
        ? status?.map(({ description, id }) => ({
            label: description,
            value: id.toString(),
          }))
        : []

      const typesFormatted = types
        ? types.map(({ description, id }) => ({
            label: description,
            value: id.toString(),
          }))
        : []

      return {
        status: statusFormatted,
        types: typesFormatted,
      }
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

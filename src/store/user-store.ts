import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import { create } from 'zustand'

type ModuleData = {
  icon: string
  name: string
  id: number
  order: number
  access: boolean
}

type UserData = {
  login: string
  name: string
  clientId: string
  group: {
    description: string
    id: number
  }
}

interface UserStoreData {
  modules: Array<ModuleData> | null
  user: UserData | null
  isLoading: boolean

  fetchUserData: () => Promise<void | AxiosError>
}

export const useUserStore = create<UserStoreData>((set) => {
  return {
    modules: null,
    user: null,
    isLoading: false,

    fetchUserData: async () => {
      set({ isLoading: true })
      const data = await api.get('/profile').then((res) => res.data)

      const modules = data?.modules.sort((a: ModuleData, b: ModuleData) => {
        return a.order > b.order ? 1 : -1
      })

      set({ modules, user: data.user, isLoading: false })

      return data
    },
  }
})

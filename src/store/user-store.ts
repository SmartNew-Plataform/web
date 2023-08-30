import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { create } from 'zustand'

type ModuleData = {
  icon: keyof typeof dynamicIconImports
  name: string
  id: number
  order: number
}

interface UserStoreData {
  modules: Array<ModuleData> | null

  fetchUserData: () => Promise<void | AxiosError>
}

export const useUserStore = create<UserStoreData>((set) => {
  return {
    modules: null,

    fetchUserData: async () => {
      const data = await api.get('/profile').then((res) => res.data)

      const modules = data?.modules.sort((a: ModuleData, b: ModuleData) => {
        return a.order > b.order ? 1 : -1
      })

      set({ modules })

      return data
    },
  }
})

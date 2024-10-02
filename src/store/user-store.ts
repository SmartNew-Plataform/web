import { ModuleData, UserData } from '@/@types/profile'
import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import { create } from 'zustand'

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

      // await api.post('login/with-login', {
      //   login: data.user.login,
      // })

      set({ modules, user: data.user, isLoading: false })

      return data
    },
  }
})

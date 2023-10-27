import { api } from '@/lib/api'
import { taskcontrolApi } from '@/lib/taskcontrol-api'
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

type BranchType = {
  id: number
  companyId: number
  productKey: string
  nLicenses: number
  branchNumber: string
  companyName: string
  tradeName: string
  registrationNumber: string
  stateRegistrationNumber: string
  cityRegistrationNumber: string
  zipCode: string
  address: string
  district: string
  city: string
  state: string
  phone: string
  fax: string
  addressComplement: string
  email: string
  site: string
  segment: string
  observations: string
  logo: string
  status: number
  limited: number
  blockItem: number
  applyChecklist: number
}

interface UserStoreData {
  modules: Array<ModuleData> | null
  user: UserData | null
  branches: BranchType[] | undefined

  fetchUserData: () => Promise<void | AxiosError>
  fetchBranches: ({ clientId }: { clientId: string }) => Promise<void>
}

export const useUserStore = create<UserStoreData>((set, get) => {
  return {
    modules: null,
    user: null,
    branches: undefined,

    fetchUserData: async () => {
      const { fetchBranches } = get()
      const data = await api.get('/profile').then((res) => res.data)

      fetchBranches({ clientId: data.user.clientId })

      const modules = data?.modules.sort((a: ModuleData, b: ModuleData) => {
        return a.order > b.order ? 1 : -1
      })

      set({ modules, user: data.user })

      return data
    },

    fetchBranches: async ({ clientId }) => {
      const response = await taskcontrolApi
        .get(`companies/${clientId}/branches`)
        .then((res) => res.data)

      set({ branches: response?.branches })
    },
  }
})

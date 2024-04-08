import {
  EmissionProduct,
  Installment,
  InstallmentData,
} from '@/@types/finance-emission'
import { SelectData } from '@/@types/select-data'
import { api } from '@/lib/api'
import { create } from 'zustand'

interface EmissionStore {
  totalProducts: number
  deleteItemId: string | undefined
  editData: EmissionProduct | undefined
  installmentsData: InstallmentData | undefined
  paymentTypes: (SelectData & { canSplit: boolean })[] | undefined
  dataInstallmentEditing:
    | {
        id: string
        dueDate: string
        valuePay: number
      }
    | undefined

  setDeleteItemId: (id: string | undefined) => void
  setEditData: (data: EmissionProduct | undefined) => void
  setDataInstallmentEditing: (
    params: EmissionStore['dataInstallmentEditing'] | undefined,
  ) => void
  typePaymentCanSplit: (id: string) => boolean

  fetchProductsData: (params: {
    emissionId: string
    type: string
  }) => Promise<EmissionProduct[]>

  fetchInstallmentsData: (params: {
    emissionId: string
    type: string
  }) => Promise<Installment[]>

  fetchInstallmentsSelects: (param: { type: string }) => Promise<SelectData[]>
}

export const useEmissionStore = create<EmissionStore>((set, get) => {
  return {
    totalProducts: 0,
    deleteItemId: undefined,
    editData: undefined,
    installmentsData: undefined,
    paymentTypes: undefined,
    dataInstallmentEditing: undefined,

    setDeleteItemId(id) {
      set({ deleteItemId: id })
    },

    setEditData(data) {
      set({ editData: data })
    },

    setDataInstallmentEditing(data) {
      set({ dataInstallmentEditing: data })
    },

    typePaymentCanSplit(id) {
      const paymentTypes = get().paymentTypes
      if (!paymentTypes) return false
      const currentPaymentType = paymentTypes?.find(({ value }) => value === id)
      if (!currentPaymentType) return false

      return currentPaymentType.canSplit
    },

    async fetchProductsData({ emissionId, type }) {
      const response = await api
        .get<{ data: EmissionProduct[] }>(
          `financial/account/finance/${emissionId}/item`,
          {
            params: {
              application: `blank_financeiro_emissao_${type}`,
            },
          },
        )
        .then((res) => res.data)

      const total = response.data.reduce(
        (acc, { total }) => acc + Number(total),
        0,
      )

      set({ totalProducts: total })

      return response.data
    },
    async fetchInstallmentsData({ emissionId, type }) {
      const response = await api
        .get<{ data: InstallmentData }>(
          `financial/account/finance/${emissionId}/installment`,
          {
            params: {
              application: `blank_financeiro_emissao_${type}`,
            },
          },
        )
        .then((res) => res.data.data)

      set({ installmentsData: response })

      return response.installment
    },

    async fetchInstallmentsSelects({ type }) {
      const response = await api
        .get(`financial/account/list-type-payment`, {
          params: {
            application: `blank_financeiro_emissao_${type}`,
          },
        })
        .then((res) => res.data.data)

      set({ paymentTypes: response })

      return response
    },
  }
})

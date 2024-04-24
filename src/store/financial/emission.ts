import {
  EmissionData,
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
  documentTypeData: SelectData[] | undefined
  providerData: SelectData[] | undefined
  branchData: SelectData[] | undefined
  canFinalize: boolean
  editable: boolean

  setDeleteItemId: (id: string | undefined) => void
  setEditData: (data: EmissionProduct | undefined) => void
  setDataInstallmentEditing: (
    params: EmissionStore['dataInstallmentEditing'] | undefined,
  ) => void
  setCanFinalize: (param: boolean) => void
  setTotalProducts: (total: number) => void
  typePaymentCanSplit: (id: string) => boolean

  fetchEmissionData: (params: {
    emissionId: string
    type: string
  }) => Promise<EmissionData>

  fetchProductsData: (params: {
    emissionId: string
    type: string
  }) => Promise<EmissionProduct[]>

  fetchInstallmentsData: (params: {
    emissionId: string
    type: string
  }) => Promise<Installment[]>

  fetchInstallmentsSelects: (param: { type: string }) => Promise<SelectData[]>
  fetchEmissionSelects: (param: { type: string }) => Promise<void>
}

export const useEmissionStore = create<EmissionStore>((set, get) => {
  return {
    totalProducts: 0,
    deleteItemId: undefined,
    editData: undefined,
    installmentsData: undefined,
    paymentTypes: undefined,
    dataInstallmentEditing: undefined,
    documentTypeData: undefined,
    providerData: undefined,
    branchData: undefined,
    canFinalize: true,
    editable: true,

    setDeleteItemId(id) {
      set({ deleteItemId: id })
    },

    setEditData(data) {
      set({ editData: data })
    },

    setDataInstallmentEditing(data) {
      set({ dataInstallmentEditing: data })
    },

    setTotalProducts(total) {
      set({ totalProducts: total })
    },

    setCanFinalize(canFinalize) {
      set({ canFinalize })
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

    async fetchEmissionData({ emissionId, type }) {
      const response = await api
        .get<{ data: EmissionData }>(
          `financial/account/finance/${emissionId}`,
          {
            params: {
              application: `blank_financeiro_emissao_${type}`,
            },
          },
        )
        .then((res) => {
          return res.data
        })

      set({
        canFinalize:
          response.data.status === 'ABERTO' && response.data.total !== 0,
        editable: response.data.editable,
      })

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

    async fetchEmissionSelects({ type }) {
      const params = {
        params: {
          application: `blank_financeiro_emissao_${type}`,
        },
      }
      const [documentTypeData, providerData, branchData] = await Promise.all([
        get().fetchInstallmentsSelects({ type }),
        api
          .get<{
            data: SelectData[]
          }>('financial/account/list-provider', params)
          .then((res) => res.data.data),
        api
          .get<{ data: SelectData[] }>('financial/account/list-branch', params)
          .then((res) => res.data.data),
      ])

      set({
        branchData,
        providerData,
        documentTypeData,
      })
    },
  }
})

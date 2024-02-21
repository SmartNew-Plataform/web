import { create } from 'zustand'

export type EmissionType = {
  id: number
  process: string
  number: string
  numberRequest: number | null
  dateEmission: Date
  issue: string
  dueDate: Date
  prorogation: Date
  expectDate: Date | null
  totalGross: number
  valuePay: number
  totalLiquid: number
  numberSplit: number
  status: string
}

interface StoreData {
  selectedRows: EmissionType[]
  setSelectedRows: (data: EmissionType[] | undefined) => void

  columns: Array<{
    label: string
    value: string
  }>
}

export const useAccountStore = create<StoreData>((set, get) => {
  return {
    selectedRows: [],
    columns: [
      {
        label: 'n° fiscal',
        value: 'fiscalNumber',
      },
      {
        label: 'Emitente',
        value: 'issue',
      },
      {
        label: 'data prevista',
        value: 'expectDate',
      },
      {
        label: 'data emissão',
        value: 'dateEmission',
      },
      {
        label: 'vencimento',
        value: 'dueDate',
      },
      {
        label: 'prorrogação',
        value: 'prorogation',
      },
      {
        label: 'total',
        value: 'totalItem',
      },
      {
        label: 'valor a pagar',
        value: 'valueToPay',
      },
      {
        label: 'valor parcela',
        value: 'valuePay',
      },
    ],

    setSelectedRows: (data) => {
      set({
        selectedRows: data,
      })
    },
  }
})

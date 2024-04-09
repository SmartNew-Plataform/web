import { SelectData } from './select-data'

export interface EmissionData {
  id: number
  documentType: string
  direction: string
  processNumber: number
  fiscalNumber: number
  paymentType: string
  frequencyPay: boolean
  total: number
  split: number
  quantitySplit: number
  dueDate: Date
  dateEmission: Date
  description: string
  dateLaunch: Date
  issue: string
  sender: string
  key: string
  status: string
  additionTotal: number
  discountTotal: number
  additionDiscount: number
  liquidTotal: number
}

export interface EmissionProduct {
  id: number
  item: string
  total: string
  bound: 'STOCK' | 'EQUIPMENT' | 'OS'
  costCenter: string
  compositionItem: SelectData
  input: SelectData | null
  material: SelectData | null
  equipment: SelectData[]
  order: SelectData[]
  quantity: string
  price: string
}

export interface Installment {
  id: number
  dueDate: string
  split: number
  prorogation: string
  status: string
  addition: number
  discount: number
  valuePay: number
  valueSplit: number
  paymentDate: string
}

export interface InstallmentData {
  paymentType: SelectData
  split: boolean
  quantitySplit: number
  dueDate: string
  totalGross: number
  totalLiquid: number
  fixedFrequency: boolean
  paymentFrequency: number
  totalAddition: number
  totalDiscount: number
  installment: Installment[]
}

export interface SearchEmission {
  id: number
  numberFiscal: string
  numberProcess: string
  emissionDate: string
  issue: string
  sender: string
}

import { SelectData } from './select-data'

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

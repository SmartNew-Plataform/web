import { SelectData } from './select-data'

export interface FuellingType {
  id: number
  type: 'internal' | 'external'
  branch: SelectData[]
  tank: SelectData
  driver: SelectData
  postName: SelectData
  // ...
}

export interface ListFuelling {
  id: number
  driver: string | null
  post: string
  receipt: string
  request: string
  date: SelectData[]
  equipment: SelectData[]
  counter: number
  previous: number
  type: string
  fuel: SelectData[]
  quantity: number
  accomplished: number
  unitary: number
  total: number
  comments: string
}

export interface TrainData {
  id: number
  train: string
  model: string
  tag: string
  compartmentAll: Array<{
    id: number
    capacity: number
    quantity: number
    odometer: number
    fuel: {
      value: number
      label: string
    }
  }>
}

export interface FuelingData {
  data: {
    id: number
    type: string
    driver: { value: string }
    fuel: { label: string; value: number }
    requestNumber: string
    fiscalNumber: string
    date: string
    equipment: { value: string }
    quantidade: number
    consumption: number
    value: number
    observation?: string
    odometerPrevious?: number
    odometer?: number
    counter?: number
    counterLast?: number
    tankFuelling?: { value: string }
    trainFuelling?: { value: string }
    tank?: { value: string }
    train?: { value: string }
    post?: { value: string }
    supplier?: string
  }
}

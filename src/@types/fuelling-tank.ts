import { SelectData } from './select-data'

export interface TankType {
  id: number
  description: string
  tag: string
  capacity: number
  branch: SelectData
}

export interface TankAndTrainResponse {
  id: number
  tank: string
  train: string
  tag: string
  model: string
  stock: number
  odometer: number
  current: number
  capacity: number
  branch: SelectData
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

export interface FuelInlet {
  id: number
  bound: {
    text: string
    value: string
  }
  provider: {
    text: string
    value: string
  }
  date: string
  typeSupplier: SelectData
  type: SelectData
  fiscalNumber: string
  total: number
}

import { SelectData } from './select-data'

export interface TankType {
  id: number
  description: string
  tag: string
  capacity: number
  branch: SelectData
}

export interface TankResponse {
  id: number
  tank: string
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
    fuel: {
      value: number
      label: string
    }
  }>
}

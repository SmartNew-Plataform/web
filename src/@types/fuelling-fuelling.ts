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

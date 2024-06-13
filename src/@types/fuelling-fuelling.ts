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

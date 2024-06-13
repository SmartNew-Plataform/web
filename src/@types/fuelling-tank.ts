import { SelectData } from './select-data'

export interface TankType {
  id: number
  description: string
  tag: string
  capacity: number
  branch: SelectData[]
}

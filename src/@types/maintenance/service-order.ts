import { SelectData } from '../select-data'

export interface RequestersData {
  id: number
  name: string
  email: string
  notification: boolean
  status: boolean
  observations: string
  branch: SelectData
}

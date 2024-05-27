import { SelectData } from './select-data'

export interface Active {
  id: number
  equipmentCode: string
  description: string
  costCenter: string | undefined
  family: {
    id: number
    name: string
  }
  typeEquipment: SelectData[] | undefined
  plate: string | undefined
  chassi: string | undefined
  serie: string | undefined
  status: string
}

export interface Component {
  id: number
  description: string
  manufacturer?: string | null
  model?: string | null
  serialNumber?: string | null
  manufacturingYear?: number | null
  status: string
}

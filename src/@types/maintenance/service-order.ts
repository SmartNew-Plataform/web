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

export type ServiceOrderData = {
  id: number
  codeServiceOrder: string
  hourPrev: string
  idClient: number
  hourMeter: number
  odometer: number
  dateEmission: string
  descriptionRequest: string
  comments: string
  descriptionServicePerformed: string
  observationsExecutor: string
  machineStop: number
  requester: string
  idRequester: number
  servicePending: string
  hasAttachment: boolean
  dateTimeRequest: string
  dateEquipmentStop: string
  dateEnd: string
  dueDate: string
  dateExpectedEnd: string
  dateEquipmentWorked: string
  idStatusServiceOrder: number
  idServiceOrderFather: number
  maintainers: string
  branch: {
    id: number
    label: string
    numberBranch: string
    name: string
  }
  equipment: {
    id: number
    label: string
    code: string
    description: string
    numberSerie?: number
    hasPeriod: boolean
    hasMileage: boolean
    hasHourMeter: boolean
    mileage?: number
    hourMeter?: number
  }
  typeMaintenance: {
    id: number
    label: string
    typeMaintenance: string
  }
  sectorExecutor: {
    id: number
    label: string
    description: string
  }
  relatedRequester: {
    id: number
    nome: string
  }
}

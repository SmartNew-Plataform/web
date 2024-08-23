export type TimekeepingResponse = {
  id: number
  description: string
  comments: string
  tasks: any
  date: string
  dateStartHour: string
  dateEndHour: string
  realTime: string
  hourValue: string
  typeMaintenance: string
  finished: number
  idProject: number
  dateEmission: string
  username: string
  idEquipment: number
  relatedEquipment: {
    id: number
    codeEquipment: string
  }
  idClient: number
  relatedCompany: {
    id: number
    companyName: string
  }
  idBranch: number
  relatedBranch: {
    id: number
    branchNumber: string
  }
  idServiceOrder: number
  relatedServiceOrder: {
    id: number
    ordem: string
  }
  idStatusServiceOrder: number
  relatedStatusServiceOrder: {
    id: number
    status: string
  }
  idEmployee: number
  relatedEmployee: {
    id: number
    name: string
  }
}

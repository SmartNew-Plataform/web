export type MaterialResponse = {
  id: number
  idBranch: number
  // category: any
  code: string
  quantity: string
  unit: string
  valueUnit: string
  // valueTotal: any
  // utilized: any
  comments: string
  dateUse: string
  serialNumberOld: string
  serialNumberNew: string
  dateEmission: string
  username: string
  idSession: string
  // idEquipment: any
  // equipment: any
  idMaterial: number
  materials: {
    id: number
    code: string
    material: string
  }
  idClient: number
  company: {
    id: number
    companyName: string
  }
  idServiceOrder: number
  serviceOrder: {
    id: number
    ordem: string
  }
  // idPlanTask: any
  // planPrev: any
  // idProgrammingR2: any
  // maintenancePlanTask: any
}

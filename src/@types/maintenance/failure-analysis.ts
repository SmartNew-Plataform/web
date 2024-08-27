export type FailureAnalysisResponse = {
  id: number
  idClient: number
  idBranch: number
  idServiceOrder: number
  idFamilyEquipment: number
  idTypeEquipment: number
  idEquipment: number
  idComponent: number
  idSymptom: number
  idCause: number
  idAction: number
  username: string
  dateEmission: string
  relatedComponent: {
    id: number
    component: string
  }
  relatedFailureSymptoms: {
    id: number
    description: string
  }
  relatedFailureCause: {
    id: number
    description: string
  }
  relatedFailureAction: {
    id: number
    description: string
  }
}

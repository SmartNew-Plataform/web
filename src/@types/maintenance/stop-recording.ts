export type StopRecordingResponse = {
  id: number
  dateEndHour: string
  dateStartHour: string
  comments: string
  entrance: number
  username: string
  dateEmission: string
  idEquipment: number
  relatedEquipment: {
    id: number
    codeEquipment: string
  }
  idServiceOrder: number
  relatedServiceOrder: {
    id: number
    ordem: string
  }
  idCause: number
  // relatedCause: any
  // idSectorExecutor: any
  // relatedSectorExecutor: any
  // idBatch: any
  // relatedNoteStopBatch: any
}

export type ConsuptionData = {
  family: string
  fuelling: Array<{
    equipmentId: number
    equipment: string
    typeConsumption: string
    expectedConsumption: number
    quantity: number
    total: number
    consumptionMade: number
    sumConsumption: number
    quantityEquipment: number
    difference: number
  }>
}

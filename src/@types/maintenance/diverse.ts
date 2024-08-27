export type DiverseResponse = {
  id: number
  idServiceOrder: number
  idDescriptionCost: number
  quantity: string
  valueUnit: string
  cost: string
  dateCost: string
  comments: string
  username: string
  dateEmission: string
  relatedDescriptionCostServiceOrder: {
    id: number
    description: string
    unit: string
  }
}

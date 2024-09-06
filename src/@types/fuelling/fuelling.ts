export type FuellingResponse = {
  id: number
  equipment: string
  fuelStation: string
  train: string
  tank: string
  compartment: string
  fiscalNumber: string
  requestNumber: string
  driver: string
  supplier: string
  user: string
  date: string
  value: string
  quantidade: string
  observation: string
  consumption: string
  odometerLast: number
  odometer: number
  counterLast: number
  counter: number
  type: string
  total: number
}

export type Product = {
  id: number
  description: string
  unity: string
}[]

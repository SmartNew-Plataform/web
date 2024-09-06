export type TankResponse = {
  id: number
  tank: string
  model: string
  stock: number
  odometer: number
  current: number
  capacity: number
  branch: {
    value: number
    label: string
  }
  compartmentAll: Array<{
    id: number
    capacity: number
    odometer?: number
    quantity: number
    fuel: {
      value: number
      label: string
    }
    fuelling: Array<{
      id: number
      date: string
      quantity: string
      fuel: {
        value: number
        label: string
      }
    }>
    tankInlet: Array<{
      id: number
      date: string
      quantity: number
      fuel: {
        value: number
        label: string
      }
    }>
  }>
  compartment: string
}

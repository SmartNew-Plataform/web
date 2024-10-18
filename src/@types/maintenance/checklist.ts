export type Model = {
  id: number
  description: string
  name: string
  item: Array<{
    id: number
    task: {
      value: string
      text: string
    }
    control: {
      value: string
      text: string
    }
  }>
}

export type ChecklistResponse = {
  id: number
  status: string
  startDate: string
  endDate: string
  model: string
  item: string
  user: string
  period: string
}

export type FamilyData = {
  id: string
  family: string
  description: string
  task: {
    id: string
    description: string
  }
}

export type FilterInfoChecklist = {
  filterText?: string
  period?: {
    from?: Date
    to?: Date
  }
}

export type AskType = {
  description: string
  id: number
  img: Array<string>
  answer: {
    color: 'dark' | 'danger' | 'success'
    description: string
    icon: 'close-circle' | 'checkmark-circle' | 'question-circle'
    id: number
    children: {
      id: number
      description: string
    }
  }
}

export type SchemaAskType = {
  isLoading?: boolean
  observation?: string
  description?: string
  id: number
  images?: Array<{ url: string }>
  answer?: Array<{
    color: 'dark' | 'danger' | 'success'
    description: string
    icon: 'close-circle' | 'checkmark-circle' | 'question-circle'
    id: number
    type: string
    children: Array<{
      id: number
      description: string
    }>
  }>
}

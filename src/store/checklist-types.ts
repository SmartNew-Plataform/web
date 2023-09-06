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
    icon: 'close-circle' | 'checkmark-circle' | 'remove-circle'
    id: number
    children: {
      id: number
      description: string
    }
  }
}

export type AnswerType = {
  color: 'dark' | 'danger' | 'success'
  description: string
  icon: 'close-circle' | 'checkmark-circle' | 'remove-circle'
  id: number
  type: string
  child: {
    id: number
    description: string
  }
}

type OptionsType = {
  children: Array<{
    id: number
    description: string
  }>
} & AnswerType

export type SchemaAskType = {
  isLoading?: boolean
  observation?: string
  description?: string
  id: number
  images?: Array<{ url: string }>
  options?: Array<OptionsType>
  answer?: AnswerType
}

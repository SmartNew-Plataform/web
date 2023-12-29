'use client'
import { SchemaAskType } from '@/store/smartlist/checklist-types'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Form } from '../form'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Status, StatusProps } from './models/status'

type AnswerType = SchemaAskType['options']

interface AnswerModelsProps {
  data: AnswerType
}

type ChildrenAnswerType = Array<{
  id: number
  description: string
}>

type AnswersType = {
  [key: string]: Array<{
    color: 'dark' | 'danger' | 'success'
    description: string
    icon: 'close-circle' | 'checkmark-circle' | 'remove-circle'
    id: number
    type: string
    children: ChildrenAnswerType
  }>
}

export function AnswerModels({ data }: AnswerModelsProps) {
  const { control } = useFormContext()
  const [currentAnswer, setCurrentAnswer] = useState<ChildrenAnswerType | null>(
    null,
  )
  const answers =
    data?.reduce<AnswersType>((acc, item) => {
      const newValue: AnswersType = {}
      if (!acc[item.type]) {
        newValue[item.type] = [item]
      } else {
        const oldValue = acc[item.type]
        newValue[item.type] = [...oldValue, item]
      }

      return newValue
    }, {}) || {}

  return (
    <>
      {Object.entries(answers).map(([type, value]) => {
        const CurrentAnswer = modelType[type]
        return (
          <div key={type}>
            <CurrentAnswer
              onChange={setCurrentAnswer}
              name="answer"
              data={value}
            />
            <Form.ErrorMessage field="answer" />
          </div>
        )
      })}
      <Controller
        control={control}
        name="children"
        render={({ field }) => (
          <RadioGroup
            name="children"
            value={field.value}
            onValueChange={field.onChange}
          >
            {currentAnswer?.map(({ description, id }) => {
              return (
                <div key={id} className="flex items-center space-x-2">
                  <RadioGroupItem value={String(id)} id={String(id)} />
                  <Label htmlFor={String(id)}>{description}</Label>
                </div>
              )
            })}
          </RadioGroup>
        )}
      />
      <Form.ErrorMessage field="children" />
    </>
  )
}

const modelType: { [key: string]: ({ name }: StatusProps) => any } = {
  STATUS: Status,
}

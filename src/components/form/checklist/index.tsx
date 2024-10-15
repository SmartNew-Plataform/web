'use client'

import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { ComponentProps, ReactNode } from 'react'
import { Controller } from 'react-hook-form'
import { Status, StatusProps } from './status'

interface ChecklistProps extends ComponentProps<'div'> {
  type: 'STATUS'
  index: number
  // defaultValue?: string
}

type StatusOption = {
  value: string
  label: string
  color: string
  action: boolean
  checkListControl: string
}

export function Checklist({ type, index, ...props }: ChecklistProps) {
  const { data } = useQuery({
    queryKey: [`form/checklist/status`],
    queryFn: async () => {
      const response = await api.get<{ data: StatusOption[] }>(
        `/system/choices/check-list-status`,
      )

      return response.data.data
    },
    retry: false,
    refetchOnMount: false,
  })

  const CurrentControl = modelType[type]
  return (
    <div {...props} className="flex w-full gap-2">
      <Controller
        name={`checklist.${index}.answer`}
        render={({ field }) => (
          <CurrentControl
            {...field}
            data={
              data?.map(({ value, label, color }) => {
                return {
                  color: color as 'dark' | 'danger' | 'success',
                  description: label,
                  icon: 'close-circle',
                  type: 'test',
                  id: Number(value),
                  children: [],
                }
              }) || []
            }
          />
        )}
      />
    </div>
  )
}

const modelType: { [key: string]: ({ name }: StatusProps) => ReactNode } = {
  STATUS: Status,
}

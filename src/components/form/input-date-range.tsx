'use client'

import * as React from 'react'
import { addDays, format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useController, useFormContext } from 'react-hook-form'
import { ptBR } from 'date-fns/locale'

interface InputDateProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
}

export function InputDateRange({ className, name }: InputDateProps) {
  const { control } = useFormContext()
  const {
    field: { value, onChange },
  } = useController({
    control,
    name,
    defaultValue: {
      from: new Date(),
      to: addDays(new Date(), 3),
    },
  })

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'justify-start text-left font-normal',
              !value && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, 'LLL dd, y', { locale: ptBR })} -{' '}
                  {format(value.to, 'LLL dd, y', { locale: ptBR })}
                </>
              ) : (
                format(value.from, 'LLL dd, y', { locale: ptBR })
              )
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

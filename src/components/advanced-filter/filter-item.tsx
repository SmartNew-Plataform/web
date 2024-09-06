/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { SelectData } from '@/@types/select-data'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { FilterType } from './filter-type'

interface FilterItemProps {
  label?: string
  value?: any
  keyName?: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'select'
  onDelete: (key: string) => void
  onChange: (key: string, value: any) => void
  options?: SelectData[]
}

export const FilterItem = ({
  label,
  value,
  keyName = '',
  type,
  onDelete,
  onChange,
  options,
}: FilterItemProps) => {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (!value) {
      setOpen(true)
    }
  }, [value, open])

  function getValueDescription(value: string) {
    return type === 'select' ? value.length : value
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center gap-1 rounded-full border border-violet-300 bg-violet-200 px-2 py-1 text-sm uppercase text-violet-500">
        <span className="font-bold">{label}</span>
        {value && <span>- {getValueDescription(value)}</span>}
      </PopoverTrigger>
      <PopoverContent className="flex flex-col">
        <div className="mb-2 flex items-end justify-between">
          <Label>{label}</Label>

          <Button
            variant="destructive"
            size="icon-xs"
            onClick={() => onDelete(keyName)}
          >
            <Trash2 size={12} />
          </Button>
        </div>
        <FilterType
          type={type}
          value={value}
          onChange={(value: string | string[]) => onChange(keyName, value)}
          options={options}
        />
      </PopoverContent>
    </Popover>
  )
}

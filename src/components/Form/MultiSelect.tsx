'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useController, useFormContext } from 'react-hook-form'
import { ScrollArea } from '../ui/scroll-area'

interface MultiSelectProps {
  name: string
  options: Array<{
    label: string
    value: string
  }>
}

export function MultiSelect({ name, options }: MultiSelectProps) {
  const { control } = useFormContext()
  const { field } = useController({
    control,
    name,
    defaultValue: [],
  })
  const [open, setOpen] = React.useState(false)

  function getLabelValues() {
    const labels = options
      .filter(({ value }) => field.value.includes(value))
      .map((item) => item.label)

    return labels.join(', ')
  }

  function handleSelect({ currentValue }: { currentValue: string }) {
    let newValue = []
    if (field.value.includes(currentValue)) {
      newValue = field.value.filter((value: string) => value !== currentValue)
    } else {
      newValue = field.value ? [...field.value, currentValue] : [currentValue]
    }

    field.onChange(newValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <span className="flex flex-1 justify-start truncate">
            {field.value.length ? getLabelValues() : 'Selecione...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Pesquisar item..." />
          <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="max-h-[30vh] overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect({ currentValue: option.value })}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      field.value.includes(option.value)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

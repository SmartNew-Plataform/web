'use client'

import { Check, ChevronsUpDown, ListChecks } from 'lucide-react'
import * as React from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
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
import { cn } from '@/lib/utils'
import { useController, useFormContext } from 'react-hook-form'
import { ScrollArea } from '../ui/scroll-area'
import { Toggle } from '../ui/toggle'
import { ComponentProps } from 'react'

interface MultiSelectProps extends ComponentProps<typeof Button> {
  name: string
  options: Array<{
    label: string
    value: string
  }>
}

export function MultiSelect({ name, options, ...props }: MultiSelectProps) {
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

  function handleToggleOptions(pressed: boolean) {
    if (pressed) {
      field.onChange(options.map((option) => option.value))
      return
    }

    field.onChange([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...props}
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
          <div className="flex items-center border-b border-slate-200 px-1">
            <CommandInput
              placeholder="Pesquisar item..."
              className="border-0"
            />
            <Toggle onPressedChange={handleToggleOptions}>
              <ListChecks className="h-4 w-4" />
            </Toggle>
          </div>
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
                      'mr-2 h-4 w-4 flex-shrink-0',
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

'use client'

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
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, ListChecks } from 'lucide-react'
import { ComponentProps, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { ScrollArea } from '../ui/scroll-area'
import { Toggle } from '../ui/toggle'

interface MultiSelectProps extends ComponentProps<typeof Button> {
  options: Array<{
    label: string
    value: string
  }>
  value: string[] | undefined
  onValueChange: (arg: string[]) => void
}

export function ComboboxMulti({
  options,
  value = [],
  onValueChange,
  className,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  function getLabelValues() {
    const labels = options
      .filter(({ value: valueItem }) => value.includes(valueItem))
      .map((item) => item.label)

    return labels.join(', ')
  }

  function handleSelect({ currentValue }: { currentValue: string }) {
    let newValue = []
    if (value.includes(currentValue)) {
      newValue = value.filter((item: string) => item !== currentValue)
    } else {
      newValue = value ? [...value, currentValue] : [currentValue]
    }

    onValueChange(newValue)
  }

  function handleToggleOptions(pressed: boolean) {
    if (pressed) {
      onValueChange(options.map((option) => option.value))
      return
    }

    onValueChange([])
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...props}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={twMerge('justify-between', className)}
        >
          <span className="flex flex-1 justify-start truncate font-semibold normal-case">
            {value.length ? getLabelValues() : 'Selecione...'}
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
                      value.includes(option.value)
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

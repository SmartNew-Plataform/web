'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { SelectData } from '@/@types/select-data'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { twMerge } from 'tailwind-merge'

interface SelectProps {
  options?: Array<SelectData>
  value?: string
  onChange: (value: string) => void
  className?: string
}

export function Select({
  options = [],
  value = undefined,
  onChange,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={twMerge('w-full justify-between normal-case', className)}
        >
          <span className="flex-1 truncate text-left font-normal">
            {value ? (
              options.find((option) => option.value === value)?.label
            ) : (
              <span className="font-medium text-zinc-500">Selecione...</span>
            )}
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
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
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

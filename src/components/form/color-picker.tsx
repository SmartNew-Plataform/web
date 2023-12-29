'use client'
import { Pipette } from 'lucide-react'
import { ComponentProps } from 'react'
import { HexColorPicker } from 'react-colorful'
import { useController, useFormContext } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface ColorPickerProps extends ComponentProps<'div'> {
  name: string
}

export function ColorPicker({ name, ...props }: ColorPickerProps) {
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
    defaultValue: '#00ff00',
  })

  return (
    <div className="flex w-full">
      <Input
        onChange={(e) => field.onChange(e.target.value)}
        value={field.value}
        className="flex-1 rounded-r-none"
      />
      <Popover {...props}>
        <PopoverTrigger asChild>
          <div
            style={{
              background: field.value,
            }}
            className={twMerge(
              'flex aspect-square h-full cursor-pointer items-center justify-center rounded-r-md',
            )}
          >
            <span className="aspect-square rounded-full bg-black/70 p-1.5">
              <Pipette className="h-4 w-4 text-white" />
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <HexColorPicker color={field.value} onChange={field.onChange} />
        </PopoverContent>
      </Popover>
    </div>
  )
}

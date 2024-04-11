import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { ComponentProps, Suspense } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { Icon } from '../icon'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

type IconData = keyof typeof dynamicIconImports

interface IconPickerProps extends ComponentProps<typeof Button> {
  name: string
}

export function IconPicker({ name }: IconPickerProps) {
  const { control } = useFormContext()
  const {
    field: { value, onChange, ref },
  } = useController({
    name,
    control,
  })
  const icons: IconData[] = [
    'circle-x',
    'circle-check',
    'circle-help',
    'info',
    'thumbs-up',
    'thumbs-down',
    'angry',
    'annoyed',
    'laugh',
    'wrench',
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          className="justify-start font-normal"
        >
          {value ? (
            <>
              <Icon name={value} className="h-4 w-4 text-zinc-800" />
              {value}
            </>
          ) : (
            'Clique para selecionar um ícone'
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex w-full flex-col">
        {icons.map((icon) => (
          <Button
            variant="ghost"
            className="w-full justify-start"
            type="button"
            onClick={() => onChange(icon)}
            key={icon}
          >
            <Suspense
              fallback={<p>carregando...</p>}
              unstable_expectedLoadTime={5000}
            >
              <Icon name={icon} className="h-4 w-4 text-zinc-800" />
            </Suspense>
            {icon}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

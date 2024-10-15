'use client'
import { cva } from 'class-variance-authority'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamic from 'next/dynamic'
import { Dispatch, SetStateAction } from 'react'
import { useController, useFormContext } from 'react-hook-form'

type ChildrenType = Array<{
  id: number
  description: string
}>

export interface StatusProps {
  name: string
  data: Array<{
    color: 'dark' | 'danger' | 'success'
    description: string
    icon: 'close-circle' | 'checkmark-circle' | 'remove-circle'
    id: number
    type: string
    children: ChildrenType
  }>
  onChange: Dispatch<SetStateAction<ChildrenType | null>>
}

type VariantsStatus =
  | 'success'
  | 'danger'
  | 'dark'
  | 'successActive'
  | 'dangerActive'
  | 'darkActive'

type ChangeStatusProps = {
  id: number
  // children: Array<{
  //   id: number
  //   description: string
  // }>
}

const statusVariants = cva(
  'aspect-square flex-1 rounded-md p-4 font-bold flex flex-col items-center justify-center gap-2',
  {
    variants: {
      variant: {
        success: 'border-2 border-emerald-500 text-emerald-500',
        danger: 'border-2 border-red-500 text-red-500',
        dark: 'border-2 border-zinc-800 text-zinc-800',
        successActive: 'bg-emerald-500 text-white',
        dangerActive: 'bg-red-500 text-white',
        darkActive: 'bg-zinc-800 text-white',
      },
    },
  },
)

export function Status({ name, data }: StatusProps) {
  const { control } = useFormContext()
  const { field } = useController({
    control,
    name,
  })

  function handleChangeStatus({ id }: ChangeStatusProps) {
    field.onChange(String(id))
  }

  // useEffect(() => {
  //   const children = data.find(
  //     (option) => option.id === Number(field.value),
  //   )?.children
  //   onChange(children || null)
  // }, [field.value])

  const iconsNames = {
    'close-circle': 'x-circle',
    'checkmark-circle': 'check-circle',
    'remove-circle': 'help-circle',
  }

  return (
    <div className="flex w-full gap-2">
      {data.map(({ description, color, id, icon }) => {
        const currentVariant: VariantsStatus =
          field.value === String(id) ? `${color}Active` : color
        const currentIcon = iconsNames[icon] as keyof typeof dynamicIconImports
        const Icon = icon
          ? dynamic(dynamicIconImports[currentIcon])
          : dynamic(dynamicIconImports.square)
        return (
          <button
            type="button"
            onClick={() => field.onChange(id.toString())}
            key={id}
            className={statusVariants({ variant: currentVariant })}
          >
            <span>{description}</span>
            <Icon />
          </button>
        )
      })}
    </div>
  )
}

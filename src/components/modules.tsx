'use client'

import { ModuleButton } from '@/components/module-button'
import { useUserStore } from '@/store/user-store'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { Skeleton } from './ui/skeleton'

const moduleIcons = {
  'flaticon-cogwheel-2': 'cog',
  'flaticon-stopwatch': 'list-todo',
  'flaticon-app': 'fuel',
  'flaticon-truck': 'bus',
  'flaticon2-protection': 'shield-check',
  'flaticon-coins': 'file-edit',
  // 'flaticon-coins': 'square',
  'flaticon-open-box': 'shopping-bag',
  'flaticon-price-tag': 'landmark',
  'flaticon2-list-3': 'list-checks',
  'flaticon2-shopping-cart': 'shopping-cart',
  'flaticon-interface-6': 'gantt-chart-square',
}

type IconNameType = keyof typeof moduleIcons

export function Modules() {
  const { modules, isLoading } = useUserStore()

  return (
    <nav className="flex max-h-full flex-col gap-2 overflow-auto px-5">
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <Skeleton className="h-12 w-12 bg-violet-700/40" key={index} />
          ))
        : modules?.map((module) => {
            const iconIndex: IconNameType = module.icon.split(
              ' ',
            )[0] as IconNameType

            const currentIcon = moduleIcons[
              iconIndex
            ] as keyof typeof dynamicIconImports
            return (
              <ModuleButton
                key={module.id}
                {...module}
                id={String(module.id)}
                // disabled={module.icon === 'flaticon2-checklist'}
                icon={currentIcon}
              />
            )
          })}
    </nav>
  )
}

'use client'

import { ModuleButton } from '@/components/module-button'
import { useUserStore } from '@/store/user-store'
import dynamicIconImports from 'lucide-react/dynamicIconImports'

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
  const { modules } = useUserStore()

  return (
    <nav className="flex flex-col gap-2">
      {modules?.map((module) => {
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

// eslint-disable-next-line no-lone-blocks
{
  /* <ModuleButton icon="shopping-bag" name="Compras" />
<ModuleButton icon="shopping-cart" name="Vendas" />
<ModuleButton icon="landmark" name="Financeiro" />
<ModuleButton icon="orbit" name="Telemetria" />
<ModuleButton icon="list-todo" name="Task Control" />
<ModuleButton icon="bus" name="Produção" />
<ModuleButton icon="cog" name="Manutenção" />
<ModuleButton icon="fuel" name="Controle de Abastecimento" />
<ModuleButton icon="shield-check" name="Security" />
<ModuleButton icon="file-edit" name="Contratos" /> */
}

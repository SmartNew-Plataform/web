'use client'

import { ModuleButton } from '@/components/ModuleButton'
import { useUserStore } from '@/store/user-store'

export function Modules() {
  const { modules } = useUserStore()

  return (
    <nav className="flex flex-col gap-2">
      {modules?.map((module) => (
        <ModuleButton key={module.id} {...module} icon="square" />
      ))}
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

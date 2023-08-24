import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamic from 'next/dynamic'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface ModuleButtonProps {
  icon: keyof typeof dynamicIconImports
  name: string
  id: number
}

export function ModuleButton({ icon, name, id }: ModuleButtonProps) {
  const Icon = dynamic(dynamicIconImports[icon])
  return (
    <Tooltip delayDuration={0.5} disableHoverableContent>
      <TooltipTrigger asChild>
        <a
          href={`https://smartnewsystem.com.br/erp/Menu-v2/?usr_modulo=${id}`}
          className="rounded p-4  text-white transition hover:bg-white hover:text-violet-500"
        >
          <Icon className="h-5 w-5" />
        </a>
      </TooltipTrigger>
      <TooltipContent sideOffset={8} side="right">
        <span>{name}</span>
      </TooltipContent>
    </Tooltip>
  )
}

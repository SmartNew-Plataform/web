import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamic from 'next/dynamic'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface ModuleButtonProps {
  icon: keyof typeof dynamicIconImports
  name: string
}

export function ModuleButton({ icon, name }: ModuleButtonProps) {
  const Icon = dynamic(dynamicIconImports[icon])
  return (
    <Tooltip delayDuration={0.5} disableHoverableContent>
      <TooltipTrigger asChild>
        <a
          href="#"
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

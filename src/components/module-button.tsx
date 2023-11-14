import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamic from 'next/dynamic'
import { ComponentProps, memo } from 'react'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface ModuleButtonProps extends ComponentProps<typeof Button> {
  icon: keyof typeof dynamicIconImports
  name: string
  id: string
  access: boolean
}

export const ModuleButton = memo(
  ({ icon, name, id, access, ...props }: ModuleButtonProps) => {
    const Icon = dynamic(dynamicIconImports[icon])
    return (
      <Tooltip delayDuration={0.5} disableHoverableContent>
        <TooltipTrigger asChild>
          <Button
            {...props}
            asChild={access}
            className="rounded  p-4 text-white transition hover:bg-white hover:text-violet-500 disabled:bg-violet-800 disabled:hover:cursor-not-allowed"
            disabled={!access}
          >
            {access ? (
              <a
                href={`https://sistemas.smartnewsystem.com.br/Menu-v2/?usr_modulo=${id}`}
                target="_blank"
              >
                <Icon className="h-5 w-5" />
              </a>
            ) : (
              <Icon className="h-5 w-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={8} side="right" className="z-[99999]">
          <span>{name}</span>
        </TooltipContent>
      </Tooltip>
    )
  },
)

ModuleButton.displayName = 'ModuleButton'

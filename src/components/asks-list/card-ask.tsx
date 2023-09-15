import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamic from 'next/dynamic'
import { memo } from 'react'
import { Card } from '../ui/card'

interface CardAskProps {
  description: string
  color: 'dark' | 'danger' | 'success'
  answer: string
  icon: 'close-circle' | 'checkmark-circle' | 'remove-circle'
  children: string
}

const answerTagVariants = cva(
  'flex items-center gap-2 rounded-full px-2 py-1 text-semibold w-max',
  {
    variants: {
      variant: {
        danger: 'bg-red-200 text-red-600',
        success: 'bg-emerald-200 text-emerald-600',
        dark: 'bg-slate-200 text-slate-600',
        default: 'border-slate-300',
      },
    },

    defaultVariants: { variant: 'default' },
  },
)

export const CardAsk = memo(
  ({ description, icon, children, color, answer }: CardAskProps) => {
    const iconsNames = {
      'close-circle': 'x-circle',
      'checkmark-circle': 'check-circle',
      'remove-circle': 'help-circle',
    }

    const currentIcon = iconsNames[icon] as keyof typeof dynamicIconImports
    const Icon = icon && dynamic(dynamicIconImports[currentIcon])

    return (
      <Card
        className={cn(
          'relative flex h-full flex-col items-start space-y-2 rounded-md p-4',
          {
            'border-2': !answer,
            'border-dashed': !answer,
            'border-slate-400': !answer,
          },
        )}
      >
        <h4 className="text-xl font-semibold text-slate-700">{description}</h4>
        <div
          className={answerTagVariants({
            variant: color || 'default',
          })}
        >
          {icon && <Icon className="h-4 w-4" />}

          <span>{answer || 'Não respondido'}</span>
        </div>
        {children && (
          <div className="flex flex-col gap-1">
            <div className="h-px w-full bg-slate-200" />
            <span className="text-zinc-400">{children}</span>
          </div>
        )}
      </Card>
    )
  },
)

CardAsk.displayName = 'CardAsk'

'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { Image } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

interface AsksListProps {
  productionId: string
}

export function AsksList({ productionId }: AsksListProps) {
  const { checklistAsksScreen, loadChecklistAsks } = useCoreScreensStore(
    ({ checklistAsksScreen, loadChecklistAsks }) => ({
      checklistAsksScreen,
      loadChecklistAsks,
    }),
  )

  useEffect(() => {
    loadChecklistAsks(productionId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log(checklistAsksScreen)

  if (!checklistAsksScreen?.table)
    return (
      <div className="flex flex-wrap gap-4">
        <Skeleton className="h-[150px] w-[370px] rounded-md" />
        <Skeleton className="h-[150px] w-[370px] rounded-md" />
        <Skeleton className="h-[150px] w-[370px] rounded-md" />
      </div>
    )

  const iconsNames = {
    'close-circle': 'x-circle',
    'checkmark-circle': 'check-circle',
    'question-circle': 'help-circle',
  }

  return (
    <>
      {checklistAsksScreen?.table.map(({ description, answer, id, img }) => {
        const currentIcon = iconsNames[
          answer?.icon
        ] as keyof typeof dynamicIconImports
        const Icon = answer?.icon && dynamic(dynamicIconImports[currentIcon])

        return (
          <Card
            key={id}
            className={cn('relative space-y-2 rounded-md p-4', {
              'border-2': !answer,
              'border-dashed': !answer,
              'border-slate-400': !answer,
            })}
          >
            {img.length > 0 && (
              <Button
                size="icon-sm"
                variant="ghost"
                className="absolute right-1 top-1"
              >
                {/* // eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="h-4 w-4" />
              </Button>
            )}
            <h4 className="text-xl font-semibold text-slate-700">
              {description}
            </h4>
            <div className="flex items-center gap-3">
              {answer?.icon && <Icon className="h-4 w-4" />}

              <span className="text-slate-600">
                {answer?.description || 'Não respondido'}
              </span>
            </div>
          </Card>
        )
      })}
    </>
  )
}

'use client'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ComponentProps } from 'react'
import { FormAction } from './form-action'

type SheetActionProps = ComponentProps<typeof Sheet>

export function SheetAction(props: SheetActionProps) {
  return (
    <Sheet {...props}>
      <SheetContent side="bottom" className="overflow-auto pb-0">
        <div className="flex max-h-[90vh] w-full justify-center gap-4">
          <FormAction />
        </div>
      </SheetContent>
    </Sheet>
  )
}

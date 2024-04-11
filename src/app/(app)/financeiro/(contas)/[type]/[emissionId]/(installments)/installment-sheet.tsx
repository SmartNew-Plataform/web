import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ComponentProps } from 'react'
import { GridInstallment } from './grid'
import { HeaderInstallment } from './header'

type InstallmentSheetProps = ComponentProps<typeof Sheet>

export function InstallmentSheet({ ...props }: InstallmentSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent side="bottom" className="max-h-[95%]">
        <div className="flex h-full flex-1 flex-col gap-4 overflow-auto">
          <HeaderInstallment />
          <GridInstallment />
        </div>
      </SheetContent>
    </Sheet>
  )
}

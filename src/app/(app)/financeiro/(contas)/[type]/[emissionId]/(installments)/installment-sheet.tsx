import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ComponentProps } from 'react'
import { GridInstallment } from './grid'
import { HeaderInstallment } from './header'

interface InstallmentSheetProps extends ComponentProps<typeof Sheet> {}

export function InstallmentSheet({ ...props }: InstallmentSheetProps) {
  return (
    <Sheet {...props}>
      <SheetContent side="bottom">
        <div className="flex flex-col gap-4">
          <HeaderInstallment />
          <GridInstallment />
        </div>
      </SheetContent>
    </Sheet>
  )
}

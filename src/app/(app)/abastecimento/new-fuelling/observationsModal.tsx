'use client'

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'

interface ObservationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  observation?: string
}

export function ObservationModal({
  open,
  onOpenChange,
  observation,
}: ObservationModalProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex max-h-screen w-1/4 flex-col overflow-x-hidden">
        <div className="mt-4 flex items-end justify-between border-b border-zinc-200 pb-4">
          <SheetTitle>Observações</SheetTitle>
        </div>
        <div className="flex h-full flex-col gap-4 overflow-auto p-4">
          <p>{observation || 'Nenhuma informação disponível.'}</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

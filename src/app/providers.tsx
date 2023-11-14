'use client'
import { GlobalLoading } from '@/components/global-loading'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from '@/contexts/query-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <TooltipProvider>
        <Toaster />
        <GlobalLoading />
        {children}
      </TooltipProvider>
    </QueryProvider>
  )
}

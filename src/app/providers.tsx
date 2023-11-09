'use client'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import { QueryProvider } from '@/contexts/query-provider'
import { api } from '@/lib/api'

export function Providers({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        console.error('Erro de resposta do servidor:', error.response.status)
        console.error('Mensagem de erro:', error.response.data)
        toast({
          title: error.response.data,
          variant: 'destructive',
        })
      }

      return Promise.reject(error)
    },
  )

  return (
    <QueryProvider>
      <TooltipProvider>
        <Toaster />
        {children}
      </TooltipProvider>
    </QueryProvider>
  )
}

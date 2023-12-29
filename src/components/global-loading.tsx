'use client'
import { useLoading } from '@/store/loading-store'
import { Loader2 } from 'lucide-react'

export function GlobalLoading() {
  const { loading } = useLoading()

  return (
    <div
      data-loading={loading}
      className="absolute inset-0 z-[9999] hidden items-center justify-center gap-4 bg-black/80 data-[loading=true]:flex"
    >
      <Loader2 className="animate-spin text-lg text-blue-400" />
      <span className="font-semibold text-white">Aguarde, carregando...</span>
    </div>
  )
}

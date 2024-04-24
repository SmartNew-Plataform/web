import { Loader2 } from 'lucide-react'

export function LoadingWithBg() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
      <Loader2 className="animate-spin text-lg text-blue-400" />
    </div>
  )
}

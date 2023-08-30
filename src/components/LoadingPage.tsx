import Lottie from 'lottie-react'
import loadingPage from '../../public/loading-page.json'

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message }: LoadingPageProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <Lottie
        animationData={loadingPage}
        loop
        alt="Carregando..."
        className="max-w-md"
      />

      {message && <span className="text-slate-600">{message}</span>}
    </div>
  )
}

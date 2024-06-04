'use client'
import { Modules } from '@/components/modules'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useLoading } from '@/store/loading-store'
import { useUserStore } from '@/store/user-store'
import { AxiosError } from 'axios'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

interface HeaderAppProps {
  children: ReactNode
}

export function HeaderApp({ children }: HeaderAppProps) {
  const { toast } = useToast()
  const { hide } = useLoading()
  const searchParams = useSearchParams()
  const { fetchUserData } = useUserStore(({ fetchUserData }) => ({
    fetchUserData,
  }))

  useEffect(() => {
    if (searchParams.has('token')) {
      const urlToken = searchParams.get('token')
      api.defaults.headers.common.Authorization = `Bearer ${urlToken}`
    }

    fetchUserData().catch((err: AxiosError<{ message: string }>) => {
      console.log(err)

      toast({
        title: err.message,
        description: err.response?.data.message,
        variant: 'destructive',
        duration: 1000 * 120,
      })
    })

    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          console.error('Erro de resposta do servidor:', error)
          hide()
          toast({
            title: error.response.data.message,
            description: error.message,
            variant: 'destructive',
            duration: 1000 * 30, // 30 seconds
          })
        }

        return Promise.reject(error)
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="flex h-screen w-screen">
      {searchParams.get('h') !== 'hidden' && (
        <menu className="sticky top-0 z-30 flex flex-col items-center gap-6 bg-violet-500 py-6">
          <Image
            src={'/smart-logo-icon.png'}
            alt={'SmartNew Logo'}
            width={30}
            height={30}
          />
          <Modules />
        </menu>
      )}

      <div className="z-20 h-full w-full overflow-auto bg-zinc-50">
        {children}
      </div>
    </div>
  )
}

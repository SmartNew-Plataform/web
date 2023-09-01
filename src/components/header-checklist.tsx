'use client'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useUserStore } from '@/store/user-store'
import { AxiosError } from 'axios'
import { AreaChart, Plus } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = true

export function HeaderChecklist() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string>()
  const { fetchUserData, modules } = useUserStore(
    ({ fetchUserData, modules }) => ({
      fetchUserData,
      modules,
    }),
  )

  useEffect(() => {
    if (searchParams.has('token')) {
      const urlToken = searchParams.get('token')
      setToken(urlToken || '')
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!modules) return
  return (
    <Header className="sticky top-0 z-30">
      <div className="flex gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" disabled>
              <Plus className="h-4 w-4" />
              Cadastro
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/checklist/task">Task</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/checklist/family">Checklist</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/checklist/bound">Vinculos</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button asChild variant="ghost">
          <Link href={`/checklist/grid?token=${token}`}>
            <AreaChart className="h-4 w-4" />
            Checklist Grid
          </Link>
        </Button>
      </div>
    </Header>
  )
}

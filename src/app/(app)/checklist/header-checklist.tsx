'use client'

import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { api } from '@/lib/api'
import { useUserStore } from '@/store/user-store'
import { AreaChart, Link, Plus } from 'lucide-react'
import { useEffect } from 'react'

export function HeaderChecklist() {
  const searchParams = new URLSearchParams(window.location.search)
  const { fetchUserData, modules } = useUserStore(
    ({ fetchUserData, modules }) => ({
      fetchUserData,
      modules,
    }),
  )

  useEffect(() => {
    if (searchParams.has('token')) {
      api.defaults.headers.common.Authorization = `Bearer ${searchParams.get(
        'token',
      )}`

      fetchUserData()
    }
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
          <Link href={`/checklist/info?token=${searchParams.get('token')}`}>
            <AreaChart className="h-4 w-4" />
            Checklist Web
          </Link>
        </Button>
      </div>
    </Header>
  )
}

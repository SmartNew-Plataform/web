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
import Link from 'next/link'
import { useEffect } from 'react'

export default function LayoutChecklist({
  children,
}: {
  children: React.ReactNode
}) {
  const { fetchUserData } = useUserStore(({ fetchUserData }) => ({
    fetchUserData,
  }))

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)

    if (searchParams.has('token')) {
      api.defaults.headers.common.Authorization = `Bearer ${searchParams.get(
        'token',
      )}`

      fetchUserData()
    }
  }, [])

  return (
    <div className="flex h-screen flex-col">
      <Header className="sticky top-0 z-30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">Cadastro</Button>
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
      </Header>
      <div className="flex h-full flex-col overflow-auto">{children}</div>
    </div>
  )
}

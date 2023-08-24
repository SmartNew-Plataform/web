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
        <div className="flex gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">+ Cadastro</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/checklist/register/task">Task</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/checklist/register/family">Checklist</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/checklist/register/bound">Vinculos</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary">
            <Link href="/checklist/web">Checklist Web</Link>
          </Button>
        </div>
      </Header>
      <div className="flex h-full flex-col overflow-auto">{children}</div>
    </div>
  )
}

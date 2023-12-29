'use client'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/store/user-store'
import { AreaChart, Plus, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = true

export function HeaderChecklist() {
  const searchParams = useSearchParams()
  const { modules } = useUserStore(({ modules }) => ({
    modules,
  }))

  if (!modules) return
  return (
    <Header className="sticky top-0 z-30">
      <div className="flex gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <Plus className="h-4 w-4" />
              Cadastro
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/checklist/tarefas',
                  query: { token: searchParams.get('token') },
                }}
              >
                Tarefas
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/checklist/controle',
                  query: { token: searchParams.get('token') },
                }}
              >
                Controle
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/checklist/vinculos',
                  query: { token: searchParams.get('token') },
                }}
              >
                Vinculos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/checklist/categoria',
                  query: { token: searchParams.get('token') },
                }}
              >
                Categorias
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button asChild variant="ghost">
          <Link
            target="_blank"
            href={`/checklist/grid?token=${searchParams.get('token')}`}
          >
            <AreaChart className="h-4 w-4" />
            Checklist
          </Link>
        </Button>

        <Button asChild variant="ghost">
          <Link
            target="_blank"
            href={`/checklist/acoes?token=${searchParams.get('token')}`}
          >
            <XCircle className="h-4 w-4" />
            Ações Geradas
          </Link>
        </Button>
      </div>
    </Header>
  )
}

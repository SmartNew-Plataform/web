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
import { AreaChart, Fuel, MessageSquare, Plus } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = true

export function HeaderFuelling() {
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
                  pathname: '/abastecimento/config-fuelling',
                  query: { token: searchParams.get('token') },
                }}
              >
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/abastecimento/create/tank',
                  query: { token: searchParams.get('token') },
                }}
              >
                Tanque
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/abastecimento/create/comboio',
                  query: { token: searchParams.get('token') },
                }}
              >
                Comboio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/abastecimento/create/equipamentos',
                  query: { token: searchParams.get('token') },
                }}
              >
                Equipamentos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/abastecimento/product',
                  query: { token: searchParams.get('token') },
                }}
              >
                Produtos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/abastecimento/control-users',
                  query: { token: searchParams.get('token') },
                }}
              >
                Usuários
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/abastecimento/create/fornecedor',
                  query: { token: searchParams.get('token') },
                }}
              >
                Fornecedor
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button asChild variant="ghost">
          <Link
            target="_blank"
            href={{
              pathname: '/abastecimento/fuel-inlet',
              query: { token: searchParams.get('token') },
            }}
          >
            <AreaChart className="h-4 w-4" />
            Entradas
          </Link>
        </Button>

        <Button asChild variant="ghost">
          <Link
            target="_blank"
            href={{
              pathname: '/abastecimento/new-fuelling',
              query: { token: searchParams.get('token') },
            }}
          >
            <Fuel className="h-4 w-4" />
            Abastecimentos
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MessageSquare className="h-4 w-4" />
              Relatórios
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/abastecimento/',
                  query: { token: searchParams.get('token') },
                }}
              >
                Posição de Estoque
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/abastecimento/relatorio-equipamento',
                  query: { token: searchParams.get('token') },
                }}
              >
                Relatório Equipamento
              </Link>
            </DropdownMenuItem> */}
            <DropdownMenuItem asChild>
              <Link
                target="_blank"
                href={{
                  pathname: '/abastecimento/consumo',
                  query: { token: searchParams.get('token') },
                }}
              >
                Análise de consumo
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Header>
  )
}

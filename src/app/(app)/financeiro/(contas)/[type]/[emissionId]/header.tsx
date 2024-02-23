'use client'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  ChevronLeft,
  File,
  Info,
  MoreVertical,
  Pencil,
  Plus,
  Rocket,
  Search,
  Trash2,
} from 'lucide-react'
import { EditEmissionModal } from './edit-emission-modal'
import { useState } from 'react'

export function HeaderEmissionPage() {
  const [editModal, setEditModal] = useState(false)
  return (
    <PageHeader>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon">
          <ChevronLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold text-zinc-700">Lançamento</h2>
      </div>

      <div className="flex items-center gap-4">
        <Button>
          <Plus size={16} />
          Adicionar
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Info size={16} />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="mr-5 flex flex-col gap-2">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                N° Processo:
              </span>
              <span className="text-zinc-500">0002034</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Tipo de documento:
              </span>
              <span className="text-zinc-500">NOTA FISCAL</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                N° Documento:
              </span>
              <span className="text-zinc-500">003045</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Identificação do emitente:
              </span>
              <span className="text-zinc-500">SMARTNEW SYSTEM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Destinatário/Remetente:
              </span>
              <span className="text-zinc-500">Fulano de tal</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Data emissão:
              </span>
              <span className="text-zinc-500">04/10/2023</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Data lançamento:
              </span>
              <span className="text-zinc-500">17/10/2023</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Chave de acesso:
              </span>
              <span className="text-zinc-500">00002030</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-slate-600">
                Observação:
              </span>
              <span className="text-zinc-500">Itens pra Wesley</span>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mr-5">
            <DropdownMenuItem className="flex items-center gap-3">
              <Search size={12} />
              Buscar lançamento
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3">
              <Rocket size={12} />
              Relançar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setEditModal(true)}
              className="flex items-center gap-3"
            >
              <Pencil size={12} />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 bg-red-200 text-red-600">
              <Trash2 size={12} />
              Excluir
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3">
              <File size={12} />
              PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditEmissionModal open={editModal} onOpenChange={setEditModal} />
    </PageHeader>
  )
}

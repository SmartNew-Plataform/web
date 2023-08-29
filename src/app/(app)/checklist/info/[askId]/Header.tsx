'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { AES } from 'crypto-js'
import { FileUp } from 'lucide-react'

export function Header() {
  const { checklistAsksScreen } = useCoreScreensStore(
    ({ checklistAsksScreen }) => ({ checklistAsksScreen }),
  )

  if (!checklistAsksScreen)
    return <Skeleton className="h-32 w-full rounded-sm" />

  const hash = AES.encrypt(String(checklistAsksScreen?.id), 'ask-checklist')

  function handleOpenChecklistPDF() {
    window.open(
      `https://pdf.smartnewsistemas.com.br/generator/checklist/asks/?id=${hash}`,
    )
  }

  return (
    <Card className="flex items-center justify-between rounded-md p-4">
      <div className="flex items-center gap-3 divide-x divide-slate-300">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-ok">Não conforme</SelectItem>
            <SelectItem value="all" defaultChecked>
              Todos
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-col gap-1 pl-2">
          <strong className="uppercase text-slate-700">Id:</strong>
          <span className="text-slate-800">{checklistAsksScreen.id}</span>
        </div>
        <div className="flex flex-col gap-1 pl-2">
          <strong className="uppercase text-slate-700">Equipamento:</strong>
          <span className="text-slate-800">
            {checklistAsksScreen.equipment}
          </span>
        </div>
        <div className="flex flex-col gap-1 pl-2">
          <strong className="uppercase text-slate-700">
            Data de abertura:
          </strong>
          <span className="text-slate-800">
            {checklistAsksScreen.startDate}
          </span>
        </div>
        <div className="flex flex-col gap-1 pl-2">
          <strong className="uppercase text-slate-700">Status:</strong>
          <span className="text-slate-800">{checklistAsksScreen.status}</span>
        </div>
        <div className="flex flex-col gap-1 pl-2">
          <strong className="uppercase text-slate-700">Condutor:</strong>
          <span className="text-slate-800">{checklistAsksScreen.user}</span>
        </div>
      </div>

      <Button onClick={handleOpenChecklistPDF}>
        <FileUp className="h-4 w-4" />
        PDF
      </Button>
    </Card>
  )
}

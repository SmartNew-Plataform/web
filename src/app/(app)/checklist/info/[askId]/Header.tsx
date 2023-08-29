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
import { AES } from 'crypto-js'
import { FileUp } from 'lucide-react'

export function Header() {
  const hash = AES.encrypt('1234', 'checklist-km034hq3')

  function handleOpenChecklistPDF() {
    window.open(
      `pdf.smartnewsistemas.com.br/generator/checklist/asks/?askId=${hash}`,
    )
  }

  return (
    <Card className="flex items-center justify-between rounded-md p-4">
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

      <Button onClick={handleOpenChecklistPDF}>
        <FileUp className="h-4 w-4" />
        PDF
      </Button>
    </Card>
  )
}

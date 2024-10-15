'use client'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'
import { FileBarChart, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { TrainModal } from './train-modal'
import { useLoading } from '@/store/loading-store'
import { useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { createBody } from './excel-export'
import dayjs from 'dayjs'

export function Header() {
  const [open, setOpen] = useState(false)

  const searchParams = useSearchParams();
  const loading = useLoading()
  const queryClient = useQueryClient()
  
  async function handleGenerateExcel() {
    loading.show()

    const filterText = searchParams.get('s') || ''
    const data = queryClient.getQueryData(['fuelling/train/data'])
    
    let records: any = []
    
    if (Array.isArray(data)) {
      records = data.map(item => [
        item.tag || '',
        item.train || '',
        item.capacity || '',
        item.branch?.label || '',                  
        item.compartment || ''
      ]);
    }
    
    const sheets = {
      sheetName: 'Equipamentos Ativos',
      headers: '###headers###',
      recordHeader: "###recordHeader###",
      recordsFormat: "###recordsFormat###",
      records
    }

    await fetch('https://excel.smartnewservices.com.br/export', {
          method: 'POST',
          mode: 'cors',
          body: createBody(sheets),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]))
            const a = document.createElement('a')
            a.href = url
            a.download = `abastecimentos_${dayjs().format('DD-MM-YYYY-HH-mm-ss')}.xlsx`
            document.body.appendChild(a)
            a.click()
            a.remove()
          })
          .catch((error) => console.error(error))

    loading.hide()
  }
  
  return (
    <PageHeader>
      <h1 className="text-xl font-semibold text-slate-600">
        Cadastro de comboio
      </h1>
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleGenerateExcel}>
          <FileBarChart size={16} />
          Excel
        </Button>
        <SearchInput />
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          novo equipamento
        </Button>
      </div>
      <TrainModal mode="create" open={open} onOpenChange={setOpen} />
    </PageHeader>
  )
}

'use client'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'
import { FileBarChart, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLoading } from '@/store/loading-store'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { createBody } from './excel-export'
import { TrainModal } from './train-modal'

export function Header() {
  const [open, setOpen] = useState(false)

  const loading = useLoading()
  const queryClient = useQueryClient()

  async function handleGenerateExcel() {
    loading.show()

    const data = queryClient.getQueryData(['fuelling/train/data'])

    let records: unknown = []

    if (Array.isArray(data)) {
      records = data.map((item) => [
        null, // campo para formatacao da row, sem dado
        item.tag || '',
        item.train || '',
        item.capacity || '',
        item.branch?.label || '',
        item.compartment || '',
      ])
    }

    const sheets = {
      sheetName: 'Cadastro de comboio',
      headers: '###headers###',
      recordHeader: '###recordHeader###',
      recordsFormat: '###recordsFormat###',
      records,
    }

    const startDate = '01/06/2024'
    const endDate = '06/09/2024'

    await fetch('https://excel.smartnewservices.com.br/api/v1/export', {
      method: 'POST',
      mode: 'cors',
      body: createBody(sheets, startDate, endDate),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const a = document.createElement('a')
        a.href = url
        a.download = `cadastro_de_comboio_${dayjs().format('DD-MM-YYYY-HH-mm-ss')}.xlsx`
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

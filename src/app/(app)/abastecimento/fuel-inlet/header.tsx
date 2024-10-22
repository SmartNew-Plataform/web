'use client'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'
import { FileBarChart, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { TankModal } from './Primary-modal'

import { useLoading } from '@/store/loading-store'
import { useQueryClient } from '@tanstack/react-query'
import { createBody } from './excel-export'

import { FuelInlet } from '@/@types/fuelling-tank'
import dayjs from 'dayjs'

function getTypeValue(typeValue: string) {
  console.log(typeValue)

  if (typeValue === 'tank') {
    return 'NF'
  }
  if (typeValue === 'train') {
    return 'INTERNO'
  }
  return '-'
}

function formatDate(dateUnformatted: string) {
  const date = new Date(dateUnformatted as string).toUTCString()
  return dayjs(date).add(3, 'hour').format('DD/MM/YYYY')
}

export function Header() {
  const [open, setOpen] = useState(false)
  const loading = useLoading()
  const queryClient = useQueryClient()

  async function handleGenerateExcel() {
    loading.show()
    const data: FuelInlet[] | undefined = await queryClient.getQueryData([
      'fuelling/create/data',
    ])
    console.log('data', data)
    loading.hide()
    if (!data) return
    const sheets = {
      sheetName: 'Registro de Entrada',
      headers: '###headers###',
      recordHeader: '###recordHeader###',
      recordsFormat: '###recordsFormat###',
      formatTableTop: '###formatTableTop###',
      records: data.map((item) => [
        null,
        formatDate(item.date),
        getTypeValue(item.type.value),
        item.fiscalNumber,
        item.bound.text,
        item.provider.text,
        item.total,
      ]),
    }

    loading.show()
    await fetch('https://excel.smartnewservices.com.br/api/v1/export', {
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
        a.download = `registro_de_entrada_${dayjs().format('DD-MM-YYYY-HH-mm-ss')}.xlsx`
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
        Registrar entrada
      </h1>
      <div className="flex gap-4">
        <Button variant="outline" onClick={handleGenerateExcel}>
          <FileBarChart size={16} />
          Excel
        </Button>
        <SearchInput />
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          nova entrada
        </Button>
      </div>
      <TankModal mode="create" open={open} onOpenChange={setOpen} />
    </PageHeader>
  )
}

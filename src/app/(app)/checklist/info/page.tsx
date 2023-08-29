'use client'
import { DataTable } from '@/components/DataTable'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { useEffect, useState } from 'react'
import { columns } from './columns'

export default function Info() {
  const [filterText, setFilterText] = useState('')
  const { loadInfo, infoScreen } = useCoreScreensStore(
    ({ loadInfo, infoScreen }) => ({
      loadInfo,
      infoScreen,
    }),
  )

  useEffect(() => {
    loadInfo()
  }, [])

  if (!infoScreen) return <p>carregando...</p>

  return (
    <div className="flex max-h-full flex-col gap-4 p-4">
      <Card className="rounded-md p-4">
        <Input
          className="max-w-sm"
          placeholder="Busca rapida"
          onChange={(e) => setFilterText(e.target.value)}
        />
      </Card>
      <DataTable
        columns={columns}
        data={infoScreen?.table || []}
        globalFilter={filterText}
      />
    </div>
  )
}

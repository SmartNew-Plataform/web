'use client'

import { DataTable } from '@/components/DataTable'
import { columns } from './columns'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { useEffect } from 'react'

export function TableInfo() {
  const { loadInfo, infoScreen } = useCoreScreensStore(
    ({ loadInfo, infoScreen }) => ({ loadInfo, infoScreen }),
  )

  useEffect(() => {
    loadInfo()
  }, [])

  if (!infoScreen?.table) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <strong>Carregando tabela...Pode demorar um minuto!</strong>
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={infoScreen?.table || []}
      globalFilter={infoScreen?.filterText || ''}
    />
  )
}

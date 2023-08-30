'use client'

import { DataTable } from '@/components/DataTable'
import { LoadingPage } from '@/components/LoadingPage'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { useEffect } from 'react'
import { columns } from './columns'

export function TableInfo() {
  const { loadInfo, infoScreen } = useCoreScreensStore(
    ({ loadInfo, infoScreen }) => ({ loadInfo, infoScreen }),
  )

  useEffect(() => {
    loadInfo()
  }, [])

  if (!infoScreen?.table) {
    return (
      <LoadingPage message="Carregando tabela...Isso pode demorar um pouco!" />
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

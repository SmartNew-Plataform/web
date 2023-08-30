'use client'

import { DataTable } from '@/components/DataTable'
import { LoadingPage } from '@/components/LoadingPage'
import { useToast } from '@/components/ui/use-toast'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { columns } from './columns'

export function TableInfo() {
  const { toast } = useToast()
  const { loadInfo, infoScreen } = useCoreScreensStore(
    ({ loadInfo, infoScreen }) => ({ loadInfo, infoScreen }),
  )

  useEffect(() => {
    loadInfo().catch((err: AxiosError<{ message: string }>) => {
      toast({
        title: err.message,
        description: err.response?.data.message,
        variant: 'destructive',
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

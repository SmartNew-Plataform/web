'use client'
import { DataTable } from '@/components/DataTable'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { useEffect } from 'react'
import { columns } from './columns'

export default function Info() {
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
      <DataTable columns={columns} data={infoScreen?.table || []} />
    </div>
  )
}

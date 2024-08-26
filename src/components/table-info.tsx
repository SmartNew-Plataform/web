'use client'

import { columns } from '@/components/columns/columns-info'
import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { api } from '@/lib/api'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { useState } from 'react'
import { AlertModal } from './alert-modal'
import { toast } from './ui/use-toast'

export function TableInfo() {
  const { infoScreen } = useCoreScreensStore()
  // console.log('columns => ', columns)

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)

  async function fetchDataTable(params: {
    index: number
    perPage: number
    dateFrom?: string
    dateTo?: string
  }) {
    console.log(infoScreen?.filter)

    const data = await api
      .get('/smart-list/check-list', {
        params: {
          ...params,
          dateFrom: infoScreen?.filter?.period?.from,
          dateTo: infoScreen?.filter?.period?.to,
        },
      })
      .then((res) => res.data)

    // console.log(data[0])

    return data
  }

  async function handleDelete() {
    if (selectedItemId !== null) {
      try {
        await api.delete(`/smart-list/check-list/${selectedItemId}`)
        toast({
          title: 'Deletado com sucesso!',
          description: 'Checklist foi deletado com sucesso.',
          variant: 'success',
        })
      } catch (error) {
        console.error('Failed to delete:', error)
      }
      setSelectedItemId(null)
    }
  }

  const handleDeleteClick = (id: number) => {
    setSelectedItemId(id)
  }

  const tableColumns = columns(handleDeleteClick)

  return (
    <>
      <DataTableServerPagination
        id="checklist-table"
        columns={tableColumns}
        fetchData={fetchDataTable}
        filterText={infoScreen?.filter?.filterText}
      />

      <AlertModal
        open={selectedItemId !== null}
        onConfirm={handleDelete}
        onOpenChange={(open) => !open && setSelectedItemId(null)}
      />
    </>
  )
}

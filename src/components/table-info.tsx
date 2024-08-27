'use client'

import { columns, InfoData } from '@/components/columns/columns-info'
import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { api } from '@/lib/api'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { useGridStore } from '@/store/smartlist/grid'
import { useState } from 'react'
import { AlertModal } from './alert-modal'
import { toast } from './ui/use-toast'

export function TableInfo() {
  const { infoScreen } = useCoreScreensStore()

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  // const [selectedRows, setSelectedRows] = useState<InfoData[]>([])

  const { setChecklistId } = useGridStore()

  async function fetchDataTable(params: {
    index: number
    perPage: number
    dateFrom?: string
    dateTo?: string
  }) {
    const data = await api
      .get('/smart-list/check-list', {
        params: {
          ...params,
          dateFrom: infoScreen?.filter?.period?.from,
          dateTo: infoScreen?.filter?.period?.to,
        },
      })
      .then((res) => res.data)

    return data
  }

  function selectRow(data: InfoData[]) {
    setChecklistId(data.map(({ id }) => id.toString()))
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
        onRowSelection={selectRow}
      />

      <AlertModal
        open={selectedItemId !== null}
        onConfirm={handleDelete}
        onOpenChange={(open) => !open && setSelectedItemId(null)}
      />
    </>
  )
}

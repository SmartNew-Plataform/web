'use client'

import { DataTableServerPagination } from '@/components/DataTableServerPagination'
import { api } from '@/lib/api'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { columns } from './columns'

export function TableInfo() {
  const { infoScreen } = useCoreScreensStore(({ infoScreen }) => ({
    infoScreen,
  }))

  async function fetchDataTable(params: { index: number; perPage: number }) {
    return api.get('/smart-list/check-list', { params }).then((res) => res.data)
  }

  return (
    <DataTableServerPagination
      columns={columns}
      fetchData={fetchDataTable}
      globalFilter={infoScreen?.filterText || ''}
    />
  )
}

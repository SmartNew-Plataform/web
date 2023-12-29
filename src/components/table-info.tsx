'use client'

import { columns } from '@/components/columns/columns-info'
import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { api } from '@/lib/api'
import { useCoreScreensStore } from '@/store/core-screens-store'

export function TableInfo() {
  const { infoScreen } = useCoreScreensStore()

  async function fetchDataTable(params: { index: number; perPage: number }) {
    return api
      .get('/smart-list/check-list', {
        params,
      })
      .then((res) => res.data)
  }

  return (
    <DataTableServerPagination
      id="checklist-table"
      columns={columns}
      fetchData={fetchDataTable}
      filterText={infoScreen?.filter?.filterText}
      dateFrom={infoScreen?.filter?.period?.from}
      dateTo={infoScreen?.filter?.period?.to}
    />
  )
}

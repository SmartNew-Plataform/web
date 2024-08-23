'use client'

import { columns } from '@/components/columns/columns-info'
import { DataTableServerPagination } from '@/components/data-table-server-pagination'
import { api } from '@/lib/api'
import { useCoreScreensStore } from '@/store/core-screens-store'

export function TableInfo() {
  const { infoScreen } = useCoreScreensStore()
  // console.log('columns => ', columns)
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

  return (
    <DataTableServerPagination
      id="checklist-table"
      columns={columns}
      fetchData={fetchDataTable}
      filterText={infoScreen?.filter?.filterText}
    />
  )
}

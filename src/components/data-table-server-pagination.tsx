'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { DataTablePagination } from '@/components/data-table-pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'

type FeactDataParamsType = {
  index: number
  perPage: number
  filterText?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  fetchData: (params: FeactDataParamsType) => Promise<{
    rows: TData[]
    pageCount: number
  }>
  filterText?: string
  dateFrom?: Date
  dateTo?: Date
}

export function DataTableServerPagination<TData, TValue>({
  columns,
  fetchData,
  filterText = '',
  dateFrom,
  dateTo,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const fetchDataOptions = {
    index: pageIndex,
    perPage: pageSize,
    filterText,
    dateFrom,
    dateTo,
  }

  const { data, isFetching } = useQuery(
    ['data', fetchDataOptions],
    () => fetchData(fetchDataOptions),
    {
      keepPreviousData: true,
    },
  )

  const defaultData = useMemo(() => [], []) as TData[]

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  )

  const table = useReactTable({
    data: data?.rows ?? defaultData,
    columns,
    pageCount: data?.pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  })

  return (
    <div className="relative flex h-full flex-col gap-4 overflow-auto">
      {isFetching && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-800/40">
          <div className="flex items-center gap-2">
            <Loader2
              className="h-6 w-6 animate-spin text-blue-500"
              strokeWidth="3"
            />
            <p className="font-semibold text-white">Carregando... Aguarde!</p>
          </div>
        </div>
      )}
      <div className="z-10 max-h-full flex-1 overflow-auto rounded-md border border-zinc-300 bg-white">
        <Table className="overflow-auto">
          <TableHeader className="sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
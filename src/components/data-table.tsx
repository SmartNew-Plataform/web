'use client'

import {
  ColumnDef,
  ColumnFiltersState,
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
import { Loader2 } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  footer?: ReactNode
  globalFilter?: string
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  footer,
  globalFilter = '',
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  useEffect(() => {
    table.setGlobalFilter(globalFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilter])

  return (
    <div className="relative flex h-full flex-col gap-4 overflow-auto">
      {isLoading && (
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
      <div className="max-h-full flex-1 overflow-auto rounded-md border border-zinc-300 bg-white">
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

          {footer && footer}
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}

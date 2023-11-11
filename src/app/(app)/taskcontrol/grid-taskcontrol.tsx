'use client'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { useTaskControlStore } from '@/store/taskcontrol/taskcontrol-store'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowDownWideNarrow, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

type CompanyData = {
  id: number
  companyName: string
  tradeName: string
}

export interface TaskControlData {
  id: number
  branch: CompanyData
  company: CompanyData
  description: string
  status: {
    id: number
    color: string
    description: string
  }
  logUser: string
  logDate: string
}

export function GridTaskControl() {
  const { loadTasks, autoLogin, tasks } = useTaskControlStore()
  const searchParams = useSearchParams()
  const columns: ColumnDef<TaskControlData>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell({ row }) {
        const id = row.getValue('id') as number

        return (
          <div className="flex gap-2">
            <Button asChild size="icon-xs">
              <Link
                href={{
                  pathname: `/taskcontrol/${id}`,
                  query: { token: searchParams.get('token') },
                }}
              >
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'branch',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Cliente
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const { companyName } = row.getValue('branch') as CompanyData

        return companyName
      },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Titulo
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue('status') as
          | TaskControlData['status']
          | null

        return status ? (
          <span
            className={twMerge('px-2 py-2 uppercase', `bg-[${status.color}]`)}
          >
            {status.description}
          </span>
        ) : (
          'Sem registro'
        )
      },
    },
    {
      accessorKey: 'logUser',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Emissor
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'logDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Emissão
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue('lodDate') as string
        return dayjs(date).format('DD/MM/YYYY HH:mm:ss')
      },
    },
  ]

  useEffect(() => {
    loadScreen()
  }, [])

  async function loadScreen() {
    await autoLogin()
    await loadTasks()
  }

  return <DataTable columns={columns} data={tasks || []} />
}

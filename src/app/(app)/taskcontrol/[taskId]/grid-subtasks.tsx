'use client'

import { DataTable } from '@/components/data-table'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useSubtaskStore } from '@/store/taskcontrol/subtask-store'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Pencil, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export interface SubtaskData {
  id: number
  title: string
  description: string
  adminStatus: string
  deadlineDate: string
  executionDeadlineDate: string
  rescheduledDate: string
  completionDate: string
  logUser: string
  logDate: string
  module: string
  task: {
    id: number
    description: string
    logUser: string
    logDate: string
  }
  status: string
  type: {
    id: number
    description: string
  }
  messages: []
  users: []
}

interface GridSubtasks {
  taskId: string
}

export function GridSubtasks({ taskId }: GridSubtasks) {
  const { loadSubtasks, subtasks } = useSubtaskStore()
  const [editSubtaskOpen, setEditSubtaskOpen] = useState(false)
  const editSubtaskForm = useForm()
  const columns: ColumnDef<SubtaskData>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell({ row }) {
        const id = row.getValue('id') as number

        return (
          <div className="flex gap-2">
            <Button size="icon-xs" onClick={() => setEditSubtaskOpen(true)}>
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    // {
    //   accessorKey: 'situation',
    //   header: 'Situação',
    // },
    {
      accessorKey: 'adminStatus',
      header: 'Status',
      // cell: ({ row }) => {
      //   const {  } = row.getValue(
      //     'status',
      //   ) as SubtaskData['status']

      //   return (
      //     <span
      //       className={twMerge(
      //         'rounded-full px-2 font-bold text-white',
      //         `bg-[${color}]`,
      //       )}
      //     >
      //       {description}
      //     </span>
      //   )
      // },
    },
    {
      accessorKey: 'task',
      header: 'Item',
      cell: ({ row }) => {
        const task = row.getValue('task') as SubtaskData['task']
        console.log(task)

        return <div className="max-w-[280px] truncate">{task?.description}</div>
      },
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
      cell: ({ row }) => {
        const description: string = row.getValue('description')

        return <div className="max-w-[280px] truncate">{description}</div>
      },
    },
    {
      accessorKey: 'logDate',
      header: 'Emissão',
      cell: ({ row }) => {
        const date: string = row.getValue('logDate')

        return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'Sem registro'
      },
    },
    {
      accessorKey: 'deadlineDate',
      header: 'Data de inicio',
      cell: ({ row }) => {
        const date: string = row.getValue('deadlineDate')

        return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'Sem registro'
      },
    },
    {
      accessorKey: 'completionDate',
      header: 'Data Prev. Termino',
      cell: ({ row }) => {
        const date: string = row.getValue('deadlineDate')

        return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'Sem registro'
      },
    },
    {
      accessorKey: 'rescheduledDate',
      header: 'Data Reprogramada',
      cell: ({ row }) => {
        const date: string = row.getValue('rescheduledDate')

        return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'Sem registro'
      },
    },
    {
      accessorKey: 'executionDeadlineDate',
      header: 'Data Finalização',
      cell: ({ row }) => {
        const date: string = row.getValue('executionDeadlineDate')

        return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'Sem registro'
      },
    },
    {
      accessorKey: 'logUser',
      header: 'Emissor',
    },
    // {
    //   accessorKey: 'approved',
    //   header: 'Aprovado',
    // },
  ]

  useEffect(() => {
    loadSubtasks({ taskId })
  }, [])

  return (
    <>
      <Sheet open={editSubtaskOpen} onOpenChange={setEditSubtaskOpen}>
        <SheetContent className="max-w-md">
          <SheetTitle>Editar Subtask</SheetTitle>
          <FormProvider {...editSubtaskForm}>
            <form className="mt-4 flex flex-col gap-3">
              <Form.Field>
                <Form.Label>Item:</Form.Label>
                <Form.Select
                  name="item"
                  options={[{ label: 'test', value: '1' }]}
                />
              </Form.Field>
              <Form.Field>
                <Form.Label>Status:</Form.Label>
                <Form.Select
                  name="status"
                  options={[{ label: 'test', value: '1' }]}
                />
              </Form.Field>
              <Form.Field>
                <Form.Label>Data Reprogramada:</Form.Label>
                <Form.Input name="reprogrammingDate" type="datetime-local" />
              </Form.Field>
              <Form.Field>
                <Form.Label>Data Finalização:</Form.Label>
                <Form.Input name="finishDate" type="datetime-local" />
              </Form.Field>
              <Form.Field>
                <Form.Label>Responsáveis:</Form.Label>
                <Form.Select
                  name="responsible"
                  options={[{ label: 'test', value: '1' }]}
                />
              </Form.Field>

              <Button>
                <Save className="h-4 w-4" />
                Salvar subtask
              </Button>
            </form>
          </FormProvider>
        </SheetContent>
      </Sheet>

      <DataTable columns={columns} data={subtasks || []} />
    </>
  )
}

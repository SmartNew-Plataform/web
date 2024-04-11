'use client'

import { DataTable } from '@/components/data-table'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { useTaskControlStore } from '@/store/taskcontrol/taskcontrol-store'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Save } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

export interface SubtaskData {
  id: number
  moduleId: number
  taskId: number
  statusId: number
  typeId: number
  title: string
  description: string
  adminStatus: number
  deadlineDate: string
  executionDeadlineDate: string
  rescheduledDate: string
  completionDate: string
  users: {
    login: string
    name: string
  }[]
}

type StatusType = {
  id: number
  description: string
  color: string
}

export function GridSubtasks() {
  const [editSubtaskOpen, setEditSubtaskOpen] = useState(false)
  const editSubtaskForm = useForm()
  const { currentTaskLoading, currentTask } = useTaskControlStore()
  const columns: ColumnDef<SubtaskData>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell() {
        // const id = row.getValue('id') as number

        return (
          <div className="flex gap-2">
            <Button size="icon-xs" onClick={() => setEditSubtaskOpen(true)}>
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'situation',
      header: 'Situação',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const { color, description }: StatusType = row.getValue('status')

        return (
          <span
            className={twMerge(
              'rounded-full px-2 font-bold text-white',
              `bg-[${color}]`,
            )}
          >
            {description}
          </span>
        )
      },
    },
    {
      accessorKey: 'item',
      header: 'Item',
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
    },
    {
      accessorKey: 'emission',
      header: 'Emissão',
    },
    {
      accessorKey: 'initialDate',
      header: 'Data de inicio',
    },
    {
      accessorKey: 'prevDate',
      header: 'Data Prev. Termino',
    },
    {
      accessorKey: 'reprogrammingDate',
      header: 'Data Reprogramada',
    },
    {
      accessorKey: 'finishDate',
      header: 'Data Finalização',
    },
    {
      accessorKey: 'emitter',
      header: 'Emissor',
    },
    {
      accessorKey: 'approved',
      header: 'Aprovado',
    },
  ]

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

      <DataTable
        columns={columns}
        isLoading={currentTaskLoading}
        data={currentTask?.subtasks || []}
      />
    </>
  )
}

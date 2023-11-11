'use client'

import { DataTable } from '@/components/data-table'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, Save } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

interface SubtaskData {
  id: number
  situation: string
  status: {
    color: string
    id: number
    description: string
  }
  item: string
  description: string
  emission: string
  initialDate: string
  prevDate: string
  reprogrammingDate: string
  finishDate: string
  emitter: string
  responsible: string
  approved: boolean
}

export function GridSubtasks() {
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
    {
      accessorKey: 'situation',
      header: 'Situação',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const { color, description } = row.getValue(
          'status',
        ) as SubtaskData['status']

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
        data={[
          {
            id: 123,
            status: {
              id: 1,
              color: '#ff0000',
              description: 'aberto',
            },
            item: 'teste',
            description: 'lorem ipsum',
            emission: '01/01/2024',
            initialDate: '01/01/2024',
            prevDate: '01/01/2024',
            reprogrammingDate: '01/01/2024',
            finishDate: '01/01/2024',
            emitter: 'dev',
            approved: true,
            responsible: 'dev',
            situation: 'Em atraso',
          },
        ]}
      />
    </>
  )
}

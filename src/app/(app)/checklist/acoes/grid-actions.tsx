'use client'

import { DataTable } from '@/components/data-table'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { ArrowDownWideNarrow, Save, Zap } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

interface GridActionsData {
  id: number
  responsible: string
  createdAt: string
  deadline: string
  equipment: string
  verify: string
  locale: string
  status: {
    description: string
    color: string
  }
}

export function GridActions() {
  const actionForm = useForm()
  const { handleSubmit } = actionForm
  const [actionId, setActionId] = useState<string | null>(null)

  async function handleOpenSheetAction(id: string) {
    setActionId(id)
  }

  const columns: ColumnDef<GridActionsData>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        const id = row.getValue('id') as GridActionsData['id']

        return (
          <Button
            size="icon-xs"
            onClick={() => handleOpenSheetAction(String(id))}
          >
            <Zap className="h-3 w-3" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'responsible',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Responsável
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Criado em
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string

        return dayjs(createdAt).format('DD/MM/YYYY')
      },
    },
    {
      accessorKey: 'deadline',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Prazo
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const deadline = row.getValue('deadline') as string

        return dayjs(deadline).format('DD/MM/YYYY')
      },
    },
    {
      accessorKey: 'equipment',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Equipamento
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'verify',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Verificação
            <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'locale',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Local
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
        const status = row.getValue('status') as GridActionsData['status']

        return (
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: status.color }}
            />
            {status.description}
          </div>
        )
      },
    },
  ]

  async function handleCreateAction(data: any) {
    console.log(data)
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={[
          {
            id: 12,
            responsible: 'Bruno Matias',
            createdAt: '2023-10-01',
            deadline: '2023-10-20',
            equipment: 'Escavadeira',
            locale: 'Goiania',
            verify: 'Limpeza eexterna',
            status: {
              description: 'Vencido',
              color: '#ff0000',
            },
          },
        ]}
      />
      <Sheet
        open={!!actionId}
        onOpenChange={(isOpen) => setActionId(isOpen ? actionId : null)}
      >
        <SheetContent className="max-w-md">
          <FormProvider {...actionForm}>
            <form
              className="flex w-full flex-col gap-3"
              onSubmit={handleSubmit(handleCreateAction)}
            >
              <Form.Field>
                <Form.Label htmlFor="description">Ação:</Form.Label>
                <Form.Textarea id="description" name="description" />
              </Form.Field>

              <Form.Field>
                <Form.Label htmlFor="responsible">Responsável:</Form.Label>
                <Form.Select options={[]} id="responsible" name="responsible" />
              </Form.Field>

              <Form.Field>
                <Form.Label htmlFor="deadline">Prazo:</Form.Label>
                <Form.DatePicker id="deadline" name="deadline" />
              </Form.Field>

              <Form.Field>
                <Form.Label htmlFor="doneAt">Data Conclusão:</Form.Label>
                <Form.DatePicker id="doneAt" name="doneAt" />
              </Form.Field>

              <Form.Field>
                <Form.Label htmlFor="attach">Anexo:</Form.Label>
                <Form.ImagePicker id="attach" name="attach" />
              </Form.Field>

              <Form.Field>
                <Form.Label htmlFor="status">Status:</Form.Label>
                <Form.Select options={[]} id="status" name="status" />
              </Form.Field>

              <Button>
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </form>
          </FormProvider>
        </SheetContent>
      </Sheet>
    </>
  )
}

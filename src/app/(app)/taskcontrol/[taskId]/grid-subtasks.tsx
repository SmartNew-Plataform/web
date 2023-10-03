'use client'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

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
          <FormProvider {...editSubtaskForm}>
            <form action=""></form>
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
              color: '#ff000',
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

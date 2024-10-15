'use client'
import { PageHeader } from '@/components/page-header'
import { Eraser, FileBarChart, ListFilter, Plus, Search } from 'lucide-react'

import { TankResponse } from '@/@types/fuelling/tank'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useFilterCreateTank } from '@/store/fuelling/filter-create'
import { useLoading } from '@/store/loading-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { TankModal } from './tank-modal'
import { createBody } from './excel-export'

const filterTankSchema = z.object({
  tag: z.string().optional(),
  description: z.string().optional(),
})

export type FilterTankData = z.infer<typeof filterTankSchema>

export function Header() {
  const [open, setOpen] = useState(false)
  const loading = useLoading()
  const queryClient = useQueryClient()
  const { setFilter } = useFilterCreateTank()

  const formFilter = useForm<FilterTankData>({
    resolver: zodResolver(filterTankSchema),
  })

  const { handleSubmit, reset } = formFilter

  async function handleGenerateExcel() {
    loading.show()
    const data: TankResponse[] | undefined = queryClient.getQueryData([
      'fuelling/create/data',
    ])
    loading.hide()
    if (!data) return
    const sheets = {
      sheetName: 'Tanques',
      headers: '###headers###',
      recordHeader:"###recordHeader###",
      recordsFormat:"###recordsFormat###",
      records: data.map((item) => (
        [
          item.model, // TAG
          item.tank, //Descrição
          item.capacity, // Capacidade máxima
          item.branch.label, // Filial
          item.compartment // Comustível
        ]
      ))
    }

    loading.show()
    await fetch('https://excel.smartnewservices.com.br/export', {
      method: 'POST',
      mode: 'cors',
      body: createBody(sheets),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const a = document.createElement('a')
        a.href = url
        a.download = `cadastro_de_tanques_${dayjs().format('DD-MM-YYYY-HH-mm-ss')}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .catch((error) => console.error(error))
    loading.hide()
  }

  async function handleFilter(data: FilterTankData) {
    setFilter(data)
  }

  function handleResetFilters() {
    reset({ tag: '', description: '' })
    setFilter({})
  }

  return (
    <PageHeader>
      <h1 className="text-xl font-semibold text-slate-600">
        Cadastro de tanques
      </h1>
      <div className="flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <ListFilter size={16} />
              Filtrar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-max">
            <FormProvider {...formFilter}>
              <form
                onSubmit={handleSubmit(handleFilter)}
                className="flex w-full flex-col gap-3"
              >
                <Form.Field>
                  <Form.Label>TAG</Form.Label>
                  <Form.Input
                    className="max-w-sm"
                    name="tag"
                    placeholder="Informe a tag"
                  />
                </Form.Field>

                <Form.Field>
                  <Form.Label>Descrição:</Form.Label>
                  <Form.Input
                    className="max-w-sm"
                    name="description"
                    placeholder="Informe a descrição"
                  />
                </Form.Field>

                <Button type="submit" variant="secondary">
                  <Search className="h-4 w-4" />
                  Buscar
                </Button>

                <Button
                  variant="ghost"
                  type="reset"
                  onClick={handleResetFilters}
                >
                  <Eraser className="h-4 w-4" />
                  Limpar filtros
                </Button>
              </form>
            </FormProvider>
          </PopoverContent>
        </Popover>

        <Button variant="outline" onClick={handleGenerateExcel}>
          <FileBarChart size={16} />
          Excel
        </Button>

        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          novo equipamento
        </Button>
      </div>
      <TankModal mode="create" open={open} onOpenChange={setOpen} />
    </PageHeader>
  )
}

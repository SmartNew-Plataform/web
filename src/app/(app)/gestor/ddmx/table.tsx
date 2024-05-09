/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-prototype-builtins */
'use client'
import { DdmxType } from '@/@types/ddmx'
import { DataTable } from '@/components/data-table'
import { Form } from '@/components/form'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'

export function Table() {
  const ddmxForm = useForm()
  const { handleSubmit, watch } = ddmxForm

  const initialDate = watch('initialDate')
  const finalDate = watch('finalDate')

  async function fetchData() {
    if (!initialDate || !finalDate) return {}

    const response = await api
      .get<DdmxType[]>(
        'https://api-gateway.portalddmx.com.br/mirror/json/pontos/ultimosPontos',
        {
          params: {
            login: 'MECBRUN',
            key: '5dfdaafdba8eb8f703cacc400dadad621cf58cbd',
            initial_date: initialDate,
            final_date: finalDate,
          },
          headers: { 'x-api-key': '33ef4c41d15f4c393f3e93255abfbfd71bf28511' },
        },
      )
      .then((res) => res.data)

    if (!response) return {}

    const data = response.reduce(
      (acc, item) => {
        const newItem = acc
        Object.entries(item).forEach(([key, value]) => {
          if (newItem.hasOwnProperty(key)) {
            // @ts-expect-error
            newItem[key] = [...newItem[key], value]
          }
        })
        console.log(newItem)

        return newItem
      },
      {
        extra: [],
        // events: [],
        general: [],
        gps: [],
        // hardware: [],
        peripheral: [],
        telemetry: [],
      },
    )

    return data
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['manager-ddmx'],
    queryFn: fetchData,
  })

  return (
    <>
      <PageHeader>
        <FormProvider {...ddmxForm}>
          <form
            className="flex items-end gap-2"
            onSubmit={handleSubmit(refetch)}
          >
            <Form.Field>
              <Form.Label htmlFor="initialDate">Data inicial:</Form.Label>
              <Form.Input type="date" name="initialDate" id="initialDate" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="finalDate">Data final:</Form.Label>
              <Form.Input type="date" name="finalDate" id="finalDate" />
            </Form.Field>

            <Button>
              <Search size={16} />
              Buscar
            </Button>
          </form>
        </FormProvider>
      </PageHeader>

      {isLoading || !data ? (
        <h1>Loading...</h1>
      ) : (
        Object.entries(data).map(([key, value]) => {
          // @ts-expect-error
          const columns = Object.keys(value[0]).map((columnName) => ({
            accessorKey: columnName,
            header: columnName,
          }))
          return (
            <div key={key} className="flex w-full flex-col gap-4">
              <h2 className="text-lg font-semibold uppercase text-slate-600">
                {key}
              </h2>
              {/* @ts-expect-error */}
              <DataTable columns={columns} data={value} />
            </div>
          )
        })
      )}
    </>
  )
}

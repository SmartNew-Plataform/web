/* eslint-disable camelcase */
'use client'
import { IdleTime } from '@/@types/ddmx'
import { DataTable } from '@/components/data-table'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { exportExcel } from '@/lib/exportExcel'
import { getDynamicColumns } from '@/lib/getDynamicColumns'
import { useDdmx } from '@/store/ddmx'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { File, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const idleTimeFormSchema = z.object(
  {
    serial: z.string(),
    initial_date: z.string(),
    final_date: z.string(),
    time_ignition_on: z.string(),
  },
  { required_error: 'Este campo e obrigatório!' },
)

type IdleTimeFormData = z.infer<typeof idleTimeFormSchema>

export function TabIdleTime() {
  const routeForm = useForm<IdleTimeFormData>({
    resolver: zodResolver(idleTimeFormSchema),
    defaultValues: {
      serial: 'MULTIPORTAL009503909',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = routeForm
  const { fetchEquipments, equipmentData } = useDdmx()
  const [data, setData] = useState<IdleTime[] | undefined>()
  const { toast } = useToast()

  async function handleFetchRoutes({
    final_date,
    initial_date,
    serial,
    time_ignition_on,
  }: IdleTimeFormData) {
    const response = await api
      .get<{ idletime: IdleTime[]; ok: boolean; message: string }>(
        'https://api-gateway.portalddmx.com.br/location/v1/json/listIdleTime',
        {
          params: {
            login: 'MECBRUN',
            key: '5dfdaafdba8eb8f703cacc400dadad621cf58cbd',
            initial_date: dayjs(initial_date).format('YYYY-MM-DD12:00:00'),
            final_date: dayjs(final_date).format('YYYY-MM-DD12:00:00'),
            serial,
            time_ignition_on,
          },
          headers: {
            'x-api-key': '33ef4c41d15f4c393f3e93255abfbfd71bf28511',
          },
        },
      )
      .then((res) => res.data)

    if (!response.ok) {
      toast({
        title: response.message,
        variant: 'destructive',
      })

      return
    }

    if (!response.idletime) return

    setData(response.idletime)
  }

  const columns = data ? getDynamicColumns({ data: data[0] }) : []

  useEffect(() => {
    if (!equipmentData) {
      fetchEquipments()
    }
  }, [equipmentData])

  return (
    <TabsContent
      value="idlePeriodEquipment"
      className="mt-0 flex max-h-full flex-col justify-start gap-4 overflow-auto"
    >
      <FormProvider {...routeForm}>
        <form
          className="mt-4 flex items-end gap-2"
          onSubmit={handleSubmit(handleFetchRoutes)}
        >
          <Form.Field>
            <Form.Label htmlFor="serial">Equipamento:</Form.Label>
            <Form.Select name="serial" options={equipmentData || []} />
            <Form.ErrorMessage field="serial" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="initialDate">Data inicial:</Form.Label>
            <Form.Input type="date" name="initial_date" id="initialDate" />
            <Form.ErrorMessage field="initial_date" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="finalDate">Data final:</Form.Label>
            <Form.Input type="date" name="final_date" id="finalDate" />
            <Form.ErrorMessage field="final_date" />
          </Form.Field>
          <Form.Field>
            <Form.Label htmlFor="time_ignition_on">
              Tempo ignição ligada:
            </Form.Label>
            <Form.Input
              type="number"
              name="time_ignition_on"
              id="time_ignition_on"
            />
            <Form.ErrorMessage field="time_ignition_on" />
          </Form.Field>

          <Button loading={isSubmitting} disabled={isSubmitting}>
            <Search size={16} />
            Buscar
          </Button>

          <Button
            onClick={() =>
              exportExcel({
                title: 'Períodos ociosos',
                data: data || [],
                filenamePrefix: 'periodos_ociosos',
              })
            }
            disabled={!data}
            className="ml-auto"
          >
            <File size={16} />
            Excel
          </Button>
        </form>
      </FormProvider>

      {!data ? (
        <p>Nenhum dado encontrado.</p>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </TabsContent>
  )
}

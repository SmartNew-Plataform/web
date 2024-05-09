/* eslint-disable camelcase */
'use client'
import { SpeedLimit } from '@/@types/ddmx'
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

const speedLimitFormSchema = z.object(
  {
    serial: z.string(),
    initial_date: z.string(),
    final_date: z.string(),
    trigger_vel: z.string(),
    percent_trigger_velmax: z.string(),
  },
  { required_error: 'Este campo e obrigatório!' },
)

type SpeedLimitFormData = z.infer<typeof speedLimitFormSchema>

export function TabSpeedLimit() {
  const routeForm = useForm<SpeedLimitFormData>({
    resolver: zodResolver(speedLimitFormSchema),
    defaultValues: {
      serial: 'MULTIPORTAL009503909',
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = routeForm
  const { fetchEquipments, equipmentData } = useDdmx()
  const [data, setData] = useState<SpeedLimit[] | undefined>()
  const { toast } = useToast()

  async function handleFetchRoutes({
    final_date,
    initial_date,
    serial,
    trigger_vel,
    percent_trigger_velmax,
  }: SpeedLimitFormData) {
    const response = await api
      .get<{ speedlimit: SpeedLimit[]; ok: boolean; message: string }>(
        'https://api-gateway.portalddmx.com.br/location/json/listSpeedLimit',
        {
          params: {
            login: 'MECBRUN',
            key: '5dfdaafdba8eb8f703cacc400dadad621cf58cbd',
            initial_date: dayjs(initial_date).format('YYYY-MM-DD12:00:00'),
            final_date: dayjs(final_date).format('YYYY-MM-DD12:00:00'),
            serial,
            trigger_vel,
            percent_trigger_velmax,
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

    if (!response.speedlimit) return

    setData(response.speedlimit)
  }

  const columns = data ? getDynamicColumns({ data: data[0] }) : []

  useEffect(() => {
    if (!equipmentData) {
      fetchEquipments()
    }
  }, [equipmentData])

  return (
    <TabsContent
      value="speedLimit"
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
            <Form.Label htmlFor="trigger_vel">Velocidade maxima:</Form.Label>
            <Form.Input type="number" name="trigger_vel" id="trigger_vel" />
            <Form.ErrorMessage field="trigger_vel" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="percent_trigger_velmax">
              Velocidade maxima acima do permitido (%):
            </Form.Label>
            <Form.Input
              type="number"
              name="percent_trigger_velmax"
              id="percent_trigger_velmax"
            />
            <Form.ErrorMessage field="percent_trigger_velmax" />
          </Form.Field>

          <Button loading={isSubmitting} disabled={isSubmitting}>
            <Search size={16} />
            Buscar
          </Button>

          <Button
            onClick={() =>
              exportExcel({
                title: 'Excessos de velocidade',
                data: data || [],
                filenamePrefix: 'excesso_velocidade',
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

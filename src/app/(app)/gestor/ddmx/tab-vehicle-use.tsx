/* eslint-disable camelcase */
'use client'
import { VehicleUse } from '@/@types/ddmx'
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

const vehicleUseFormSchema = z.object(
  {
    serial: z.string(),
    initial_date: z.string(),
    final_date: z.string(),
  },
  { required_error: 'Este campo e obrigatório!' },
)

type VehicleUseFormData = z.infer<typeof vehicleUseFormSchema>

export function TabVehicleUse() {
  const routeForm = useForm<VehicleUseFormData>({
    resolver: zodResolver(vehicleUseFormSchema),
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = routeForm
  const { fetchEquipments, equipmentData } = useDdmx()
  const [data, setData] = useState<VehicleUse[] | undefined>()
  const { toast } = useToast()

  async function handleFetchRoutes({
    final_date,
    initial_date,
    serial,
  }: VehicleUseFormData) {
    const response = await api
      .get<{ vehicleuse: VehicleUse[]; ok: boolean; message: string }>(
        'https://api-gateway.portalddmx.com.br/location/json/listvehicleuse',
        {
          params: {
            login: 'MECBRUN',
            key: '5dfdaafdba8eb8f703cacc400dadad621cf58cbd',
            initial_date: dayjs(initial_date).format('YYYY-MM-DD12:00:00'),
            final_date: dayjs(final_date).format('YYYY-MM-DD12:00:00'),
            serial,
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

    setData(response.vehicleuse)
  }

  const columns = data ? getDynamicColumns({ data: data[0] }) : []

  useEffect(() => {
    if (!equipmentData) {
      fetchEquipments()
    }
  }, [equipmentData])

  return (
    <TabsContent
      value="vehicleUse"
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

          <Button loading={isSubmitting} disabled={isSubmitting}>
            <Search size={16} />
            Buscar
          </Button>

          <Button
            onClick={() =>
              exportExcel({
                title: 'Utilizações',
                data: data || [],
                filenamePrefix: 'utilizacoes',
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

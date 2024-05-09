/* eslint-disable camelcase */
'use client'
import { Maintenance } from '@/@types/ddmx'
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
import { File, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const maintenanceFormSchema = z.object(
  {
    serial: z.string(),
  },
  { required_error: 'Este campo e obrigatório!' },
)

type MaintenanceFormData = z.infer<typeof maintenanceFormSchema>

export function TabMaintenance() {
  const routeForm = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceFormSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = routeForm
  const { fetchEquipments, equipmentData } = useDdmx()
  const [data, setData] = useState<Maintenance[] | undefined>()
  const { toast } = useToast()

  async function handleFetchRoutes({ serial }: MaintenanceFormData) {
    const response = await api
      .get<{ maintenances: Maintenance[]; ok: boolean; message: string }>(
        'https://api-gateway.portalddmx.com.br/location/json/listMaintenances',
        {
          params: {
            login: 'MECBRUN',
            key: '5dfdaafdba8eb8f703cacc400dadad621cf58cbd',
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

    if (!response.maintenances) return

    setData(response.maintenances)
  }

  const columns = data ? getDynamicColumns({ data: data[0] }) : []

  useEffect(() => {
    if (!equipmentData) {
      fetchEquipments()
    }
  }, [equipmentData])

  return (
    <TabsContent
      value="maintenances"
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

          <Button loading={isSubmitting} disabled={isSubmitting}>
            <Search size={16} />
            Buscar
          </Button>

          <Button
            onClick={() =>
              exportExcel({
                title: 'Manutenções',
                data: data || [],
                filenamePrefix: 'manutencoes',
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

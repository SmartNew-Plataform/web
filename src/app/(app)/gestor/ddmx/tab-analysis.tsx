/* eslint-disable camelcase */
'use client'
import { Analysis } from '@/@types/ddmx'
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

const analysisFormSchema = z.object(
  {
    serial: z.string(),
    date: z.string(),
    hours: z.string(),
  },
  { required_error: 'Este campo e obrigatório!' },
)

type AnalysisFormData = z.infer<typeof analysisFormSchema>

export function TabAnalysis() {
  const routeForm = useForm<AnalysisFormData>({
    resolver: zodResolver(analysisFormSchema),
  })
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = routeForm
  const { fetchEquipments, equipmentData } = useDdmx()
  const [data, setData] = useState<Analysis[] | undefined>()
  const { toast } = useToast()

  async function handleFetchRoutes({ date, serial, hours }: AnalysisFormData) {
    const response = await api
      .get<{ analises: Analysis[]; ok: boolean; message: string }>(
        'https://api-gateway.portalddmx.com.br/location/json/calculaAnaliseData',
        {
          params: {
            login: 'MECBRUN',
            key: '5dfdaafdba8eb8f703cacc400dadad621cf58cbd',
            date: dayjs(date).format('YYYY-MM-DD12:00:00'),
            serial,
            hours,
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

    setData(response.analises)
  }

  const columns = data ? getDynamicColumns({ data: data[0] }) : []

  useEffect(() => {
    if (!equipmentData) {
      fetchEquipments()
    }
  }, [equipmentData])

  return (
    <TabsContent
      value="analysis"
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
            <Form.Label htmlFor="date">Data inicial:</Form.Label>
            <Form.Input type="date" name="date" id="date" />
            <Form.ErrorMessage field="date" />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="hours">Hora:</Form.Label>
            <Form.Input type="number" name="hours" id="hours" />
            <Form.ErrorMessage field="hours" />
          </Form.Field>

          <Button loading={isSubmitting} disabled={isSubmitting}>
            <Search size={16} />
            Buscar
          </Button>

          <Button
            onClick={() =>
              exportExcel({
                title: 'Analise',
                data: data || [],
                filenamePrefix: 'analise',
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

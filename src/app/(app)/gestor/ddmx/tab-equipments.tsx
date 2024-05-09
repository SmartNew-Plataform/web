'use client'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { TabsContent } from '@/components/ui/tabs'
import { exportExcel } from '@/lib/exportExcel'
import { getDynamicColumns } from '@/lib/getDynamicColumns'
import { useDdmx } from '@/store/ddmx'
import { useQuery } from '@tanstack/react-query'
import { File } from 'lucide-react'

export function TabEquipments() {
  const { fetchEquipments } = useDdmx()

  const { data, isLoading } = useQuery({
    queryKey: ['ddmx-equipments'],
    queryFn: fetchEquipments,
  })

  const columns = data ? getDynamicColumns({ data: data[0] }) : []

  return (
    <TabsContent
      value="equipments"
      className="flex max-h-full flex-col overflow-auto"
    >
      <Button
        onClick={() =>
          exportExcel({
            title: 'Equipamentos',
            data: data || [],
            filenamePrefix: 'equipamentos',
          })
        }
        disabled={!data}
        className="mb-4 self-end"
      >
        <File size={16} />
        Excel
      </Button>
      {!data || isLoading ? (
        <p>Carregando...</p>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </TabsContent>
  )
}

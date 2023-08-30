'use client'

import { DataTableServerPagination } from '@/components/DataTableServerPagination'
import { useToast } from '@/components/ui/use-toast'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { columns } from './columns'

export function TableInfo() {
  const { toast } = useToast()
  const { loadInfo, infoScreen } = useCoreScreensStore(
    ({ loadInfo, infoScreen }) => ({ loadInfo, infoScreen }),
  )

  // useEffect(() => {
  //   loadInfo().catch((err: AxiosError<{ message: string }>) => {
  //     toast({
  //       title: err.message,
  //       description: err.response?.data.message,
  //       variant: 'destructive',
  //       duration: 1000 * 120,
  //     })
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  // if (!infoScreen?.table) {
  //   return (
  //     <LoadingPage message="Carregando tabela...Isso pode demorar um pouco!" />
  //   )
  // }

  return (
    <DataTableServerPagination
      columns={columns}
      data={infoScreen?.table || []}
      globalFilter={infoScreen?.filterText || ''}
    />
  )
}

'use client'
import { RequestersData } from '@/@types/maintenance/service-order'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { ComponentProps } from 'react'
import { RequesterFormModal } from './requester-form-modal'

interface RequesterModalProps extends ComponentProps<typeof Dialog> {}

export function RequesterModal({ ...props }: RequesterModalProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['maintenance/service-order/requester'],
    queryFn: async () => {
      const response = await api
        .get<{ data: RequestersData[] }>('/maintenance/requester')
        .then((res) => res.data.data)

      return response
    },
  })

  return (
    <Dialog {...props}>
      <DialogContent>
        <div className="flex items-end justify-between border-b border-zinc-300 py-4">
          <h2 className="text-2xl font-normal text-zinc-700">Solicitantes</h2>
          <RequesterFormModal>
            <Button type="button">
              <Plus size={16} />
              Novo
            </Button>
          </RequesterFormModal>
        </div>
        <div className="grid h-full grid-cols-auto gap-4 overflow-auto">
          {isLoading ? (
            <>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </>
          ) : (
            <>
              {data?.map(({ id, email, name, status }) => {
                return (
                  <Card
                    className="flex flex-col gap-2 rounded border border-zinc-300 p-4"
                    key={id}
                  >
                    <div className="flex items-end justify-between">
                      <span className="font-1xl font-semibold text-zinc-700">
                        {name}
                      </span>

                      <div className="flex gap-2">
                        <Button
                          size="icon-xs"
                          variant="destructive"
                          type="button"
                        >
                          <Trash2 size="12" />
                        </Button>
                        <Button size="icon-xs" type="button">
                          <Pencil size="12" />
                        </Button>
                      </div>
                    </div>
                    <span className="font-sm text-zinc-500">{email}</span>
                    <span className="font-sm text-zinc-500">
                      {status ? 'Ativado' : 'Desativado'}
                    </span>
                  </Card>
                )
              })}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

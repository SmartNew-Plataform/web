'use client'
import { Button } from '@/components/ui/button'
import { currencyFormat } from '@/lib/currencyFormat'
import dayjs from 'dayjs'
import { Trash2 } from 'lucide-react'
import { PaymentData } from './emission-modal'
import { TributesModal } from './tributes-modal'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface GroupCardProps extends PaymentData {
  length: number
  index: number
  emitted: boolean
  emissionId?: number
}

export function GroupCard({
  dueDate,
  provider,
  value,
  length,
  index,
  emitted,
  id,
  emissionId,
}: GroupCardProps) {
  const [splitInLoading, setEmissionInLoading] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleDeleteSplit() {
    setEmissionInLoading(true)
    const response = await api
      .delete(`financial/account/split/${id}`)
      .then((res) => res.data)
    setEmissionInLoading(false)

    if (!response.deleted) return

    toast({
      title: 'Parcela deletada com sucesso!',
      variant: 'success',
    })
    queryClient.refetchQueries(['financial-emission-groups'])
  }

  return (
    <div className="flex w-full justify-between pt-3">
      <div className="flex flex-1 flex-col gap-1">
        <strong className="text-lg text-slate-700">{provider}</strong>
        <span className="text-lg text-slate-600">
          {dayjs(dueDate).format('DD/MM/YYYY')}
        </span>
      </div>

      <div className="flex flex-col items-end gap-1">
        <div className="flex gap-2">
          <Button
            size="icon-xs"
            variant="destructive"
            onClick={handleDeleteSplit}
            loading={splitInLoading}
            disabled={splitInLoading}
          >
            <Trash2 className="w-4" />
          </Button>
          {emitted && (
            <TributesModal emissionId={emissionId || 0} splitId={id} />
          )}
          <span className="text-md rounded-full bg-slate-200 px-2 py-1 text-slate-700">
            {index + 1}/{length}
          </span>
        </div>
        <strong className="text-lg text-slate-700">
          {currencyFormat(value)}
        </strong>
      </div>
    </div>
  )
}

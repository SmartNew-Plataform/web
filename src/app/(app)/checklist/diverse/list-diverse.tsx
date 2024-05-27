'use client'
import { AlertModal } from '@/components/alert-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useDiverse } from '@/store/smartlist/diverse'
import { useQuery } from '@tanstack/react-query'
import { Pencil, Trash } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { DiverseModal } from './diverse-modal'

export interface DiverseData {
  value: number
  text: string
  tag: string
  branch: {
    value: number
    text: string
  }
}

export function ListDiverse() {
  const [diverseIdToDelete, setDiverseIdToDelete] = useState<
    number | undefined
  >()
  const { editingData, setEditingData } = useDiverse()
  const searchParams = useSearchParams()

  const filter = searchParams.get('s') || ''

  const { toast } = useToast()

  async function fetchDiverseList() {
    const response: DiverseData[] | undefined = await api
      .get('smart-list/location', { params: { s: filter } })
      .then((res) => res.data.data)

    return response
  }

  const { data, refetch } = useQuery({
    queryKey: ['checklist-diverse-list', filter],
    queryFn: fetchDiverseList,
  })

  async function handleDeleteDiverse() {
    const response = await api.delete(
      `smart-list/location/${diverseIdToDelete}`,
    )

    if (response.status !== 200) return

    toast({
      title: 'Diverso deletado com sucesso!',
      variant: 'success',
    })
    refetch()
  }

  return (
    <main className="grid max-h-full grid-cols-auto gap-4 overflow-auto">
      {data?.map(({ text, value, tag, branch }) => {
        return (
          <Card key={value}>
            <CardContent className="relative pt-5">
              <p>
                {tag} - {text}
              </p>

              <div className="absolute right-4 top-4 flex gap-2">
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => setDiverseIdToDelete(value)}
                >
                  <Trash size={14} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={() =>
                    setEditingData({ text, value, branchId: branch.value })
                  }
                >
                  <Pencil size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}

      <AlertModal
        open={!!diverseIdToDelete}
        onOpenChange={(open) =>
          setDiverseIdToDelete(open ? diverseIdToDelete : undefined)
        }
        onConfirm={handleDeleteDiverse}
      />

      <DiverseModal
        open={!!editingData}
        onOpenChange={(open) => setEditingData(open ? editingData : undefined)}
        mode="edit"
      />
    </main>
  )
}

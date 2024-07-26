'use client'
import { AlertModal } from '@/components/alert-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash } from 'lucide-react'
import { ComponentProps, useState } from 'react'
import { z } from 'zod'
import { InletFormData, ModalInletForm } from './reportform'

const createActiveFormSchema = z.object({
  compartmentId: z.string(),
})

export type ActiveFormData = z.infer<typeof createActiveFormSchema>

interface ActiveFormProps extends ComponentProps<typeof Sheet> {
  tankId: string
}

interface TankFormProps {
  id: number
  fiscalNumber: string
  date: string
  value: number
  compartmentId: string
  type: {
    label: string
    value: string
  }
  bound: {
    value: string
    text: string
  }
  provider: {
    value: string
    text: string
  }
  user: string
  quantity: number
  total: number
  product: {
    id: number
    compartmentId: number
    value: number
    quantity: number
  }
}

export function FuelModal({ tankId, ...props }: ActiveFormProps) {
  const [createModalOpen, setCreatModalOpen] = useState(false)
  const [createEditModalOpen, setCreateEditModalOpen] = useState<
    | { id: number; compartmentId: string; quantity: number; value: number }
    | undefined
  >()
  const [compartmentIdToDelete, setCompartmentIdToDelete] = useState<
    number | undefined
  >()

  async function fetchCompartment() {
    const response = await api
      .get(`fuelling/input/${tankId}`)
      .then((response) => response.data)
    return response.data.product || []
  }
  const queryClient = useQueryClient()

  const { data, refetch } = useQuery<TankFormProps[]>({
    queryKey: [`fuelling/input`, tankId],

    queryFn: fetchCompartment,
  })

  async function handleCreateCompartment(data: InletFormData) {
    const response = await api.post(`fuelling/input/${tankId}/product`, {
      compartmentId: String(data.compartmentId),
      quantity: data.quantity,
      value: data.value,
    })

    if (response.status !== 201) return
    refetch()
    toast({
      title: `Entrada criada com sucesso`,
      variant: 'success',
    })

    queryClient.refetchQueries([`fuelling/input`, tankId])
  }

  async function handleEditCompartment({
    compartmentId,
    quantity,
    value,
  }: InletFormData) {
    const response = await api.put(
      `fuelling/input/${tankId}/product/${createEditModalOpen?.id}`,
      { compartmentId, quantity, value },
    )

    if (response.status !== 200) return
    refetch()
    toast({
      title: `Entrada editada com sucesso`,
      variant: 'success',
    })

    queryClient.refetchQueries([`fuelling/input/${tankId}`])
  }

  async function handleDeleteTrain() {
    const response = await api.delete(
      `fuelling/input/${tankId}/product/${compartmentIdToDelete}`,
    )

    if (response.status !== 200) return

    toast({
      title: 'Entrada deletada com sucesso!',
      variant: 'success',
    })
    refetch()
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex max-h-screen w-1/4 flex-col overflow-x-hidden">
        <div className="mt-4 flex items-end justify-between border-b border-zinc-200 pb-4">
          <SheetTitle>Entradas realizadas</SheetTitle>
          <Button onClick={() => setCreatModalOpen(true)}>
            <Plus size={16} />
            Novo
          </Button>
        </div>
        <div className="flex h-full flex-col gap-4 overflow-auto">
          {data?.map(({ id, value, quantity, compartmentId }) => (
            <Card key={id}>
              <CardContent className="relative pt-5">
                <p>{compartmentId}</p>
                <p>Quantidade: {quantity} L </p>
                <p>Valor: {value} R$</p>
                <div className="absolute right-4 top-4 flex gap-2">
                  <Button
                    onClick={() => setCompartmentIdToDelete(id)}
                    variant="destructive"
                    size="icon-sm"
                  >
                    <Trash size={14} />
                  </Button>
                  <Button
                    onClick={() =>
                      setCreateEditModalOpen({
                        id,
                        quantity,
                        value,
                        compartmentId: String(compartmentId),
                      })
                    }
                    variant="secondary"
                    size="icon-sm"
                  >
                    <Pencil size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <ModalInletForm
          onSubmit={handleCreateCompartment}
          open={createModalOpen}
          onOpenChange={setCreatModalOpen}
        />

        <ModalInletForm
          mode="edit"
          defaultValues={createEditModalOpen}
          tankId={''}
          onSubmit={handleEditCompartment}
          open={!!createEditModalOpen}
          onOpenChange={(open) =>
            setCreateEditModalOpen(open ? createEditModalOpen : undefined)
          }
        />

        <AlertModal
          open={!!compartmentIdToDelete}
          onOpenChange={(open) =>
            setCompartmentIdToDelete(open ? compartmentIdToDelete : undefined)
          }
          onConfirm={handleDeleteTrain}
        />
      </SheetContent>
    </Sheet>
  )
}

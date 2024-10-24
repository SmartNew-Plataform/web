'use client'
import { AlertModal } from '@/components/alert-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash } from 'lucide-react'
import { ComponentProps, useState } from 'react'
import { z } from 'zod'
import {
  CompartmentFormData,
  ModalCompartmentForm,
} from './modal-compartiment-form'

const createActiveFormSchema = z.object({})

export type ActiveFormData = z.infer<typeof createActiveFormSchema>

interface ActiveFormProps extends ComponentProps<typeof Sheet> {
  trainId: string
}

interface TankFormProps {
  compartment: {
    value: string
    fuel: { label: string; value: number }
    capacity: number
    quantity: number
    id: number
  }[]
  model: string
  train: string
}

export function FuelModal({ trainId, ...props }: ActiveFormProps) {
  const [createModalOpen, setCreatModalOpen] = useState(false)
  const [createEditModalOpen, setCreateEditModalOpen] = useState<
    { fuel: string; capacity: number; id: number } | undefined
  >()
  const [compartmentIdToDelete, setCompartmentIdToDelete] = useState<
    number | undefined
  >()

  async function fetchCompartment() {
    const response = await api
      .get(`fuelling/train/${trainId}`)
      .then((response) => response.data)
    return response.data
  }
  const queryClient = useQueryClient()

  const { data, refetch } = useQuery<TankFormProps>({
    queryKey: ['fuelling/train/compartment', trainId],
    queryFn: fetchCompartment,
  })

  async function handleCreateCompartment(data: CompartmentFormData) {
    const response = await api.post(`fuelling/train/${trainId}/compartment`, {
      fuelId: data.fuel,
      capacity: data.capacity,
    })

    if (response.status !== 201) return
    refetch()
    toast({
      title: `Compartimento criado com sucesso`,
      variant: 'success',
    })
    queryClient.refetchQueries(['fuelling/train/compartment'])
  }

  async function handleEditCompartment({
    capacity,
    fuel,
  }: CompartmentFormData) {
    const response = await api.put(
      `fuelling/train/${trainId}/compartment/${createEditModalOpen?.id}`,
      { fuelId: fuel, capacity },
    )

    if (response.status !== 200) return
    refetch()
    toast({
      title: `Compartimento editado com sucesso`,
      variant: 'success',
    })
    queryClient.refetchQueries(['fuelling/train/compartment'])
  }

  async function handleDeleteTrain() {
    const response = await api.delete(
      `fuelling/train/${trainId}/compartment/${compartmentIdToDelete}`,
    )

    if (response.status !== 200) return

    toast({
      title: 'Compartimento deletado com sucesso!',
      variant: 'success',
    })
    refetch()
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex max-h-screen flex-col overflow-x-hidden">
        <div className="mt-4 flex items-end justify-between border-b border-zinc-200 pb-4">
          <div className="flex flex-col">
            <SheetTitle>Compartimentos</SheetTitle>
            <SheetDescription>{data?.train}</SheetDescription>
          </div>
          <Button onClick={() => setCreatModalOpen(true)}>
            <Plus size={16} />
            Novo
          </Button>
        </div>
        <div className="flex h-full flex-col gap-4 overflow-auto">
          {data?.compartment?.map(({ fuel, capacity, value, id, quantity }) => {
            return (
              <Card key={value}>
                <CardContent className="relative pt-5">
                  <p>{fuel.label}</p>
                  <p>Capacidade: {capacity}L</p>
                  <p>Saldo: {quantity}</p>
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
                          fuel: fuel.value.toString(),
                          capacity,
                          id,
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
            )
          })}
        </div>

        <ModalCompartmentForm
          onSubmit={handleCreateCompartment}
          open={createModalOpen}
          onOpenChange={setCreatModalOpen}
        />

        <ModalCompartmentForm
          mode="edit"
          defaultValues={createEditModalOpen}
          trainId={''}
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

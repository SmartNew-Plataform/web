'use client'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { FuelForm, SupplyFormData } from './fuelForm'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  async function fetchSelects() {
    const response = await api.get('fuelling/info').then((res) => res.data)
    return response.data
  }

  const { refetch } = useQuery({
    queryKey: ['fuelling/data'],
    queryFn: fetchSelects,
  })

  async function handleCreateFuelling(data: SupplyFormData) {
    const response = api.post('fuelling/', {
      ...data,
      equipmentId: data.equipment,
      type: data.type,
      fuelStationId: data.post,
      trainId: data.train,
      tankId: data.tank,
      fuelId: data.fuel,
      compartmentId: data.compartment,
      numberRequest: data.request,
      fiscalNumber: data.receipt,
      value: data.value,
      currentCounter: data.last,
      observation: data.comments,
      counterLast: data.last,
      odometerLast: data.odometerPrevious,
    })

    if ((await response).status !== 201) return

    toast({
      title: 'Abastecimento criado com sucesso!',
      variant: 'success',
    })

    refetch()
  }

  return (
    <PageHeader>
      <h2 className="text-xl font-semibold text-slate-600">
        Registrar abastecimento
      </h2>
      <Button onClick={() => setIsOpen(true)}>
        <Plus size={16} />
        Novo abastecimento
      </Button>
      <FuelForm
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleCreateFuelling}
        mode="create"
      />
    </PageHeader>
  )
}

'use client'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useActives } from '@/store/smartlist/actives'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, QrCode } from 'lucide-react'
import { useState } from 'react'
import { ActiveForm, ActiveFormData } from './active-form'
import { QRCodeModal } from './qrcode-modal'

export function Header() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenQrCode, setIsOpenQrCode] = useState(false)
  const { selects, setQrCodeEquipments } = useActives()

  async function handleCreateActive(data: ActiveFormData) {
    const responseEquipment = await api.post('system/equipment', data)
    if (responseEquipment.status !== 201) return
    toast({
      title: `${data.description} foi criado com sucesso!`,
      variant: 'success',
    })

    const equipmentId = responseEquipment.data.id
    data.images?.forEach(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      console.log(file)

      const response = await api.post(
        `system/equipment/${equipmentId}/attach`,
        formData,
      )

      if (response.status !== 201) return

      toast({
        title: 'Anexo inseridos com sucesso!',
        variant: 'success',
      })
    })

    data.components?.forEach(async (component) => {
      const response = await api.post(
        `system/equipment/${equipmentId}/component`,
        component,
      )

      if (response.status !== 201) return

      toast({
        title: `${component.description} foi criado com sucesso!`,
        variant: 'success',
      })
    })

    queryClient.refetchQueries(['checklist-list-actives'])
  }

  function handleOpenQrCodeModal() {
    const equipments = selects.equipmentDad?.map(({ value }) => value)
    setQrCodeEquipments(equipments)
    setIsOpenQrCode(true)
  }

  return (
    <>
      <PageHeader>
        <h1 className="text-xl font-semibold text-slate-600">
          Equipamentos Ativos
        </h1>

        <div className="flex gap-4">
          <SearchInput />
          <Button onClick={() => setIsOpen(true)}>
            <Plus size={16} />
            Ativo
          </Button>
          <Button variant="outline" onClick={handleOpenQrCodeModal}>
            <QrCode size={16} />
            Gerar QRCode
          </Button>
        </div>
      </PageHeader>
      <ActiveForm
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleCreateActive}
        mode="create"
      />
      <QRCodeModal
        open={isOpenQrCode}
        multiple
        onOpenChange={setIsOpenQrCode}
      />
    </>
  )
}

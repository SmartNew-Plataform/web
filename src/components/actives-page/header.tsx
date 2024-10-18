'use client'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useLoading } from '@/store/loading-store'
import { useActives } from '@/store/smartlist/actives'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FileBarChart, Plus, QrCode } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ActiveForm, ActiveFormData } from './active-form'
import { createBody } from './excel-export'
import { QRCodeModal } from './qrcode-modal'

export function Header() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenQrCode, setIsOpenQrCode] = useState(false)
  const { selects, setQrCodeEquipments } = useActives()
  const searchParams = useSearchParams()
  const loading = useLoading()

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

  async function handleGenerateExcel() {
    loading.show()

    const filterText = searchParams.get('s') || ''
    const data = await queryClient.getQueryData([
      'checklist-list-actives',
      filterText,
    ])

    let records: any = []

    if (Array.isArray(data)) {
      records = data.map((item) => [
        null, // campo para formatacao da row, sem dado
        item.id || '', // id
        item.branch?.label || '', // cliente
        item.costCenter?.label || '', // centro de custo
        item.equipmentCode || '', // código do equipamento
        item.description || '', // descrição tag
        item.family?.label || '', // família
        item.typeEquipment?.label || '', // tipo de equipamento
        item.inGuarantee || '', // em garantia
        item.plate || '', // placa
        item.chassi || '', // chassi
        item.serie || '', // nº série
        item.status || '', // status
        item.observation || '', // observação
      ])
    }

    const sheets = {
      sheetName: 'Equipamentos Ativos',
      headers: '###headers###',
      recordHeader: '###recordHeader###',
      recordsFormat: '###recordsFormat###',
      records,
    }

    //const startDate = null
    //const endDate = null
    const startDate = "01/06/2024"
    const endDate = "06/09/2024"


    await fetch('https://excel.smartnewservices.com.br/api/v1/export', {
      method: 'POST',
      mode: 'cors',
      body: createBody(sheets,startDate, endDate),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const a = document.createElement('a')
        a.href = url
        a.download = `cadastro_equipamentos_${dayjs().format('DD-MM-YYYY-HH-mm-ss')}.xlsx`
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .catch((error) => console.error(error))

    loading.hide()
  }

  return (
    <>
      <PageHeader>
        <h1 className="text-xl font-semibold text-slate-600">
          Equipamentos Ativos
        </h1>

        <div className="flex gap-4">
          <Button variant="outline" onClick={handleGenerateExcel}>
            <FileBarChart size={16} />
            Excel
          </Button>
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

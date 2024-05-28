'use client'
import { Active, Component } from '@/@types/active'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useLoading } from '@/store/loading-store'
import { useActives } from '@/store/smartlist/actives'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Pencil, QrCode, Trash2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ActiveForm, ActiveFormData } from './active-form'
import { QRCodeModal } from './qrcode-modal'

export function Table() {
  const {
    setSelects,
    setImages,
    setEquipmentId,
    setQrCodeEquipments,
    equipmentId,
    setComponents,
    addComponent,
  } = useActives()
  const searchParams = useSearchParams()
  const [currentActive, setCurrentActive] = useState<
    ActiveFormData | undefined
  >()
  const [qrCodeIsOpen, setQrCodeIsOpen] = useState(false)
  const { toast } = useToast()
  const loading = useLoading()

  const filterText = searchParams.get('s') || ''

  async function fetchActives() {
    const response = await api
      .get<{ data: Active[] }>('system/equipment', {
        params: {
          filterText: searchParams.get('s'),
        },
      })
      .then((res) => res.data)

    return response.data
  }

  async function fetchSelects() {
    const [
      client,
      equipmentDad,
      costCenter,
      family,
      equipmentStatus,
      consumptionType,
      unityMeter,
      fleet,
      componentStatus,
    ] = await Promise.all([
      await api.get('system/list-branch').then((res) => res.data.data),
      await api
        .get<{ data: Active[] }>('system/equipment')
        .then((res) => res.data.data),
      await api.get('system/list-cost-center').then((res) => res.data.data),
      await api.get('smart-list/family').then((res) => res.data),
      await api
        .get('system/equipment/list-status-equipment')
        .then((res) => res.data.data),
      await api
        .get('system/equipment/list-consumption-type')
        .then((res) => res.data.data),
      await api.get('system/equipment/list-unity').then((res) => res.data.data),
      await api.get('system/equipment/list-fleet').then((res) => res.data.data),
      await api
        .get('system/equipment/list-component-status')
        .then((res) => res.data.data),
    ])

    setSelects({
      equipmentDad: equipmentDad.map(({ id, description }) => ({
        label: description,
        value: id.toString(),
      })),
      client,
      costCenter,
      family: family.map(({ id, family }: { id: number; family: string }) => ({
        label: family,
        value: id.toString(),
      })),
      equipmentStatus,
      consumptionType,
      unityMeter,
      fleet,
      componentStatus,
    })
  }

  const { data, refetch } = useQuery({
    queryKey: ['checklist-list-actives', filterText],
    queryFn: fetchActives,
  })

  useQuery({
    queryKey: ['checklist-actives-selects'],
    queryFn: fetchSelects,
  })

  async function handleEditActive(data: ActiveFormData) {
    const response = await api.put(`system/equipment/${equipmentId}`, data)
    if (response.status !== 200) return

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

      addComponent({
        id: response.data.id,
        ...component,
      })

      toast({
        title: `${component.description} foi criado com sucesso!`,
        variant: 'success',
      })
    })

    toast({
      title: `${data.description} foi atualizado com sucesso!`,
      variant: 'success',
    })

    setCurrentActive(undefined)
    setEquipmentId(undefined)
    setImages(undefined)
    setComponents(undefined)
    refetch()
  }

  async function fetchActive(id: number) {
    setEquipmentId(id)
    loading.show()
    const response = await api
      .get<{ data: ActiveFormData }>(`system/equipment/${id}`)
      .then((res) => res.data)
    loading.hide()

    if (!response.data) {
      setEquipmentId(undefined)
      return toast({
        title: 'Equipamento não encontrado!',
        variant: 'destructive',
      })
    }

    setCurrentActive(response.data)

    loading.show()
    const images = await api
      .get<{ img: Array<{ url: string }> }>(`system/equipment/${id}/attach`)
      .then((res) => res.data)
    loading.hide()

    loading.show()
    const components = await api
      .get<{ data: Component[] }>(`system/equipment/${id}/component`)
      .then((res) => res.data)
    loading.hide()

    setImages(images.img.map(({ url }) => url))
    setComponents(components.data)
  }

  async function handleDeleteEquipment(id: number) {
    loading.show()
    const response = await api.delete(`system/equipment/${id}`)
    loading.hide()

    if (response.status !== 200) return

    toast({
      title: 'Equipamento deletado com sucesso!',
      variant: 'success',
    })

    refetch()
  }

  function handleOpenQrCodeModal(equipmentId: string) {
    setQrCodeEquipments([equipmentId])
    setQrCodeIsOpen(true)
  }

  const columns: ColumnDef<Active>[] = [
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon-xs"
              onClick={() => fetchActive(row.getValue('id'))}
            >
              <Pencil size={12} />
            </Button>
            <Button
              variant="destructive"
              size="icon-xs"
              onClick={() => handleDeleteEquipment(row.getValue('id'))}
            >
              <Trash2 size={12} />
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => handleOpenQrCodeModal(String(row.getValue('id')))}
            >
              <QrCode size={12} />
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: 'id',
      header: 'id',
    },
    {
      accessorKey: 'branch.label',
      header: 'cliente',
    },
    {
      accessorKey: 'costCenter.label',
      header: 'centro custo',
      cell: (row) => {
        return <p className="whitespace-nowrap">{row.getValue() as string}</p>
      },
    },
    {
      accessorKey: 'equipmentCode',
      header: 'Equipamento código',
    },
    {
      accessorKey: 'description',
      header: 'Descrição tag',
    },
    {
      accessorKey: 'family.label',
      header: 'Familia',
    },
    {
      accessorKey: 'typeEquipment.label',
      header: 'equipamento tipo',
    },
    {
      accessorKey: 'inGuarantee',
      header: 'Em garantia?',
    },
    {
      accessorKey: 'plate',
      header: 'Placa',
    },
    {
      accessorKey: 'chassi',
      header: 'chassi',
    },
    {
      accessorKey: 'serie',
      header: 'n° serie',
    },
    {
      accessorKey: 'status',
      header: 'Status Equipamento',
    },
    {
      accessorKey: 'observation',
      header: 'observação',
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={data || []} />
      <ActiveForm
        open={!!currentActive}
        onOpenChange={(open) => {
          if (open) {
            setCurrentActive(currentActive)
          } else {
            setCurrentActive(undefined)
            setEquipmentId(undefined)
            setImages(undefined)
            setComponents(undefined)
          }
        }}
        mode="edit"
        onSubmit={handleEditActive}
        defaultValues={currentActive}
      />
      <QRCodeModal open={qrCodeIsOpen} onOpenChange={setQrCodeIsOpen} />
    </>
  )
}

'use client'
import { PageHeader } from '@/components/page-header'
import { SearchInput } from '@/components/search-input'
import { Button } from '@/components/ui/button'
import { useDiverse } from '@/store/smartlist/diverse'
import { Plus, QrCode } from 'lucide-react'
import { useState } from 'react'
import { DiverseModal } from './diverse-modal'
import { QRCodeModal } from './qrcode-modal'
import { SheetCategories } from './sheet-categories'

export function Header() {
  const [open, setOpen] = useState(false)
  const [openQrCode, setOpenQrCode] = useState(false)
  const { setQrCodeDiverse, diverse } = useDiverse()

  function handleOpenQrCode() {
    const diverseValues = diverse?.map(({ value }) => value)
    setOpenQrCode(true)
    setQrCodeDiverse(diverseValues)
  }

  return (
    <PageHeader>
      <h2 className="text-lg font-bold text-slate-600">Cadastro de diversos</h2>

      <div className="flex gap-3">
        <SearchInput />
        <SheetCategories />
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          diverso
        </Button>
        <Button variant="outline" onClick={handleOpenQrCode}>
          <QrCode size={16} />
          Gerar Qrcode
        </Button>
      </div>
      <DiverseModal mode="create" open={open} onOpenChange={setOpen} />
      <QRCodeModal open={openQrCode} onOpenChange={setOpenQrCode} multiple />
    </PageHeader>
  )
}

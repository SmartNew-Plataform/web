'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useActives } from '@/store/smartlist/actives'
import { zodResolver } from '@hookform/resolvers/zod'
import CryptoJS from 'crypto-js'
import { ExternalLink } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import QRCode from 'react-qr-code'
import { z } from 'zod'

const activeQrCodeSchema = z.object({
  active: z.array(z.string(), {
    required_error: 'Selecione pelo menos 1 equipamento!',
  }),
  width: z.coerce.number().optional(),
  withActive: z.boolean().optional(),
  withTag: z.boolean().optional(),
  withReport: z.boolean().optional(),
})

type ActiveQrCodeData = z.infer<typeof activeQrCodeSchema>

interface QRCodeModalProps extends ComponentProps<typeof Dialog> {
  multiple?: boolean
}

export function QRCodeModal({ multiple = false, ...props }: QRCodeModalProps) {
  const { selects, qrCodeEquipments } = useActives()
  const activeQrCodeForm = useForm<ActiveQrCodeData>({
    resolver: zodResolver(activeQrCodeSchema),
    defaultValues: {
      width: 150,
      withActive: true,
      withReport: true,
      withTag: true,
    },
  })

  const { watch, setValue, handleSubmit } = activeQrCodeForm

  useEffect(() => {
    if (!qrCodeEquipments) return
    setValue('active', qrCodeEquipments)
  }, [qrCodeEquipments])

  const width = watch('width')
  const withTag = watch('withTag')
  const firstEquipmentId = qrCodeEquipments ? qrCodeEquipments[0] : ''
  const firstEquipment = selects.equipmentDad?.find(
    ({ value }) => value === firstEquipmentId,
  )?.label

  function handleGenerateQrCode(data: ActiveQrCodeData) {
    const hash = CryptoJS.AES.encrypt(JSON.stringify(data), 'qrcode-equipments')
    window.open(
      `https://pdf.smartnewsistemas.com.br/generator/manager/qrCodeEquipments?params=${hash}`,
    )
  }

  return (
    <Dialog {...props}>
      <DialogContent className="flex max-w-3xl gap-2">
        <FormProvider {...activeQrCodeForm}>
          <form
            className="flex max-w-xs flex-1 flex-col gap-3"
            onSubmit={handleSubmit(handleGenerateQrCode)}
          >
            {selects.equipmentDad ? (
              <Form.Field>
                <Form.Label>Ativos:</Form.Label>
                <Form.MultiSelect
                  name="active"
                  disabled={!multiple}
                  options={selects.equipmentDad}
                />
                <Form.ErrorMessage field="active" />
              </Form.Field>
            ) : (
              <Form.SkeletonField />
            )}
            <Form.Field>
              <Form.Label>Largura :</Form.Label>
              <Form.Input type="number" name="width" min="80" max="550" />
              <Form.ErrorMessage field="width" />
            </Form.Field>
            <Form.Field>
              <Form.Label className="flex items-center gap-2">
                <Form.Checkbox name="withActive" />
                Incluir ativos no PDF
              </Form.Label>
              <Form.ErrorMessage field="withActive" />
            </Form.Field>
            <Form.Field>
              <Form.Label className="flex items-center gap-2">
                <Form.Checkbox name="withTag" />
                Incluir TAG do(s) ativo(s) no PDF
              </Form.Label>
              <Form.ErrorMessage field="withTag" />
            </Form.Field>
            <Form.Field>
              <Form.Label className="flex items-center gap-2">
                <Form.Checkbox name="withReport" />
                Incluir relatório(s) no PDF
              </Form.Label>
              <Form.ErrorMessage field="withReport" />
            </Form.Field>
            <Button>
              Gerar PDF
              <ExternalLink size={16} />
            </Button>
          </form>
        </FormProvider>

        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="rounded-md border border-zinc-200 p-3 shadow">
            <QRCode value="hello world" size={width} />
          </div>
          {withTag && (
            <span className="rounded border border-zinc-200 px-1.5 shadow">
              {firstEquipment}
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

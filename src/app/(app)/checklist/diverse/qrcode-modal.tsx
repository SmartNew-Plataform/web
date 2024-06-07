'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useDiverse } from '@/store/smartlist/diverse'
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
  const { qrCodeDiverse, diverse } = useDiverse()
  const activeQrCodeForm = useForm<ActiveQrCodeData>({
    resolver: zodResolver(activeQrCodeSchema),
    defaultValues: {
      width: 150,
      withActive: true,
      withReport: false,
      withTag: true,
    },
  })

  const { watch, setValue, handleSubmit } = activeQrCodeForm

  useEffect(() => {
    if (!qrCodeDiverse) return
    setValue('active', qrCodeDiverse)
  }, [qrCodeDiverse])

  const width = watch('width')
  const withTag = watch('withTag')
  const firstEquipmentId = qrCodeDiverse ? qrCodeDiverse[0] : ''
  const firstEquipment = diverse?.find(
    ({ value }) => value === firstEquipmentId,
  )?.label

  function handleGenerateQrCode(data: ActiveQrCodeData) {
    const hash = CryptoJS.AES.encrypt(
      JSON.stringify({
        ...data,
        withReport: false,
      }),
      'qrcode-diverse',
    )
    window.open(
      `https://pdf.smartnewsistemas.com.br/generator/manager/qrCodeDiverse?params=${hash}`,
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
            {diverse ? (
              <Form.Field>
                <Form.Label>Ativos:</Form.Label>
                <Form.MultiSelect
                  name="active"
                  disabled={!multiple}
                  options={diverse}
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
            {/* <Form.Field>
              <Form.Label className="flex items-center gap-2">
                <Form.Checkbox name="withActive" />
                Incluir ativos no PDF
              </Form.Label>
              <Form.ErrorMessage field="withActive" />
            </Form.Field> */}
            <Form.Field>
              <Form.Label className="flex items-center gap-2">
                <Form.Checkbox name="withTag" />
                Incluir TAG do(s) ativo(s) no PDF
              </Form.Label>
              <Form.ErrorMessage field="withTag" />
            </Form.Field>

            <Button>
              Gerar PDF
              <ExternalLink size={16} />
            </Button>
          </form>
        </FormProvider>

        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="rounded-md border border-zinc-200 p-3 shadow">
            <QRCode value={firstEquipmentId} size={width} />
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

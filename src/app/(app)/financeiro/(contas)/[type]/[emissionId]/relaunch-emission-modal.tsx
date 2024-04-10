'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { SendHorizonal } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ComponentProps, useState } from 'react'

interface RelaunchEmissionModalProps extends ComponentProps<typeof Dialog> {}

export function RelaunchEmissionModal({
  ...props
}: RelaunchEmissionModalProps) {
  const [fiscalNumber, setFiscalNumber] = useState<string | undefined>(
    undefined,
  )

  const routeParams = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  async function handleRelaunchEmission() {
    if (!fiscalNumber) {
      toast({
        title: 'O campo numero fiscal e obrigatório!',
        variant: 'destructive',
      })
      return
    }

    const response = await api.post(
      `financial/account/finance/${routeParams.emissionId}/duplicate/`,
      {
        application: `blank_financeiro_emissao_${routeParams.type}`,
        fiscalNumber: Number(fiscalNumber),
      },
    )

    if (response.status !== 201) return

    toast({
      title: 'Emissão duplicada com sucesso!',
      variant: 'success',
    })

    router.push(
      `../${routeParams.type}/${response.data.id}?h=hidden&token=${searchParams.get('token')}`,
    )
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Numero fiscal"
            value={fiscalNumber}
            onChange={(e) => setFiscalNumber(e.target.value)}
          />

          <Button onClick={handleRelaunchEmission}>
            Enviar
            <SendHorizonal size={16} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

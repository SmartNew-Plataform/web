import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

interface TankModalProps extends ComponentProps<typeof Dialog> {
  mode: 'create' | 'edit'
}

const tankFormSchema = z.object({
  description: z.string({ required_error: 'Este campo e obrigatório!' }).min(1),
  branch: z.string({ required_error: 'Escola uma filial!' }),
  tag: z.string({ required_error: 'Este campo e obrigatório!' }),
})

type TankFormData = z.infer<typeof tankFormSchema>

export function TankModal({ mode, ...props }: TankModalProps) {
  const diverseForm = useForm<TankFormData>({
    resolver: zodResolver(tankFormSchema),
  })
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = diverseForm

  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleCreateDiverse({
    branch,
    description,
    tag,
  }: TankFormData) {}
  return (
    <Dialog {...props}>
      <DialogContent>
        <FormProvider {...diverseForm}>
          <form className="flex w-full flex-col gap-2">
            <Form.Field>
              <Form.RadioGroup name="type" className="flex">
                <RadioGroupItem value="internal" id="internal" />
                <Form.Label htmlFor="internal">Interno</Form.Label>

                <RadioGroupItem value="external" id="internal" />
                <Form.Label htmlFor="external">Externo</Form.Label>
              </Form.RadioGroup>
              <Form.ErrorMessage field="type" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="tag-input">TAG:</Form.Label>
              <Form.Input name="tag" id="tag-input" />
              <Form.ErrorMessage field="tag" />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="branch-input">Filial:</Form.Label>
              <Form.Select name="branch" id="branch-input" options={[]} />
              <Form.ErrorMessage field="branch" />
            </Form.Field>

            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              <Save size={16} />
              Salvar
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

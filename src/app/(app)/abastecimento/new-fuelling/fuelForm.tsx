'use client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { ComponentProps, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { StepOne } from './steps/step-one'

const createActiveFormSchema = z.object({})

export type ActiveFormData = z.infer<typeof createActiveFormSchema>

interface ActiveFormProps extends ComponentProps<typeof Sheet> {
  onSubmit: (data: ActiveFormData) => Promise<void>
  defaultValues?: ActiveFormData
  mode: 'create' | 'edit'
}

export function FuelForm({
  onSubmit,
  mode,
  defaultValues,
  ...props
}: ActiveFormProps) {
  const createActiveForm = useForm<ActiveFormData>({
    resolver: zodResolver(createActiveFormSchema),
  })

  const {
    handleSubmit,
    reset,
    resetField,
    formState: { isSubmitting },
  } = createActiveForm

  useEffect(() => {
    if (!defaultValues) return
    reset(defaultValues)
  }, [defaultValues, reset])

  async function handleSubmitIntermediate(data: ActiveFormData) {
    await onSubmit(data)
    if (mode !== 'create') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      resetField('components', [])
      return
    }
    reset()
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex max-h-screen w-1/4 flex-col overflow-x-hidden">
        <FormProvider {...createActiveForm}>
          <h2 className="mt-4 text-xl font-semibold text-slate-600">
            Informações do abastecimento
          </h2>

          <form
            id="active-form"
            onSubmit={handleSubmit(handleSubmitIntermediate)}
            className="mt-4 flex h-full w-full flex-col gap-3 overflow-auto overflow-x-hidden"
          >
            <StepOne />
          </form>
          <div className="w-full gap-3 bg-white pt-4">
            <div className="flex gap-3">
              <Button
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
                type="submit"
                variant="success"
                form="active-form"
              >
                <Save size={16} />
                Salvar
              </Button>
            </div>
          </div>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

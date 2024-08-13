'use client'

import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { AES } from 'crypto-js'
import { ChevronLeft, FileUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

export function Header() {
  const filterForm = useForm<{ status: string[] }>({
    defaultValues: { status: [] },
  })
  const { checklistAsksScreen, changeChecklistAsksTable } = useCoreScreensStore(
    ({ checklistAsksScreen, changeChecklistAsksTable }) => ({
      checklistAsksScreen,
      changeChecklistAsksTable,
    }),
  )
  const router = useRouter()

  const statusFilter = filterForm.watch('status')

  useEffect(() => {
    changeChecklistAsksTable(statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  if (!checklistAsksScreen)
    return <Skeleton className="h-32 w-full rounded-sm" />

  const hash = AES.encrypt(String(checklistAsksScreen?.id), 'ask-checklist')

  return (
    <Card className="flex items-center justify-between rounded-md p-4">
      <div className="flex items-center gap-2">
        <Button size="icon" variant="secondary" onClick={router.back}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 divide-x divide-slate-300">
          <FormProvider {...filterForm}>
            <form>
              <Form.MultiSelect
                name="status"
                options={checklistAsksScreen.allStatus.map(
                  ({ id, description }) => ({
                    value: String(id),
                    label: description,
                  }),
                )}
              />
            </form>
          </FormProvider>

          <div className="flex flex-col gap-1 pl-2">
            <strong className="uppercase text-slate-700">N° checklist:</strong>
            <span className="text-slate-800">{checklistAsksScreen.id}</span>
          </div>
          <div className="flex flex-col gap-1 pl-2">
            <strong className="uppercase text-slate-700">Ativo/Diverso:</strong>
            <span className="text-slate-800">{checklistAsksScreen.item}</span>
          </div>
          <div className="flex flex-col gap-1 pl-2">
            <strong className="uppercase text-slate-700">
              Data de abertura:
            </strong>
            <span className="text-slate-800">
              {checklistAsksScreen.startDate}
            </span>
          </div>
          <div className="flex flex-col gap-1 pl-2">
            <strong className="uppercase text-slate-700">Status:</strong>
            <span className="text-slate-800">{checklistAsksScreen.status}</span>
          </div>
          <div className="flex flex-col gap-1 pl-2">
            <strong className="uppercase text-slate-700">Condutor:</strong>
            <span className="text-slate-800">{checklistAsksScreen.user}</span>
          </div>
          <div className="flex flex-col gap-1 pl-2">
            <strong className="uppercase text-slate-700">
              Tipo Checklist:
            </strong>
            <span className="text-slate-800">{checklistAsksScreen.model}</span>
          </div>
        </div>
      </div>

      <Button asChild>
        <Link
          href={`https://pdf.smartnewservices.com.br/generator/checklist/asks/?id=${hash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FileUp className="h-4 w-4" />
          PDF
        </Link>
      </Button>
    </Card>
  )
}

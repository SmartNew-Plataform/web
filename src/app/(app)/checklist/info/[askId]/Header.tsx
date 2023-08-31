/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { Form } from '@/components/Form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { AES } from 'crypto-js'
import { FileUp } from 'lucide-react'
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

  const statusFilter = filterForm.watch('status')
  console.log(statusFilter)

  useEffect(() => {
    changeChecklistAsksTable(statusFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  if (!checklistAsksScreen)
    return <Skeleton className="h-32 w-full rounded-sm" />

  const hash = AES.encrypt(String(checklistAsksScreen?.id), 'ask-checklist')

  function handleOpenChecklistPDF() {
    window.open(
      `https://pdf.smartnewsistemas.com.br/generator/checklist/asks/?id=${hash}`,
    )
  }

  return (
    <Card className="flex items-center justify-between rounded-md p-4">
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
          <strong className="uppercase text-slate-700">Id:</strong>
          <span className="text-slate-800">{checklistAsksScreen.id}</span>
        </div>
        <div className="flex flex-col gap-1 pl-2">
          <strong className="uppercase text-slate-700">Equipamento:</strong>
          <span className="text-slate-800">
            {checklistAsksScreen.equipment}
          </span>
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
      </div>

      <Button onClick={handleOpenChecklistPDF}>
        <FileUp className="h-4 w-4" />
        PDF
      </Button>
    </Card>
  )
}

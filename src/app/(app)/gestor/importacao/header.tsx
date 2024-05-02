'use client'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/form'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FolderSync, Upload } from 'lucide-react'
import { api } from '@/lib/api'
import { useImportation } from '@/store/manager/importation'

const importationFormSchema = z.object({
  file: z.instanceof(FileList),
  template: z.string({ required_error: 'Este campo é obrigatório' }),
})

type ImportationFormData = z.infer<typeof importationFormSchema>

export function Header() {
  const importationForm = useForm<ImportationFormData>({
    resolver: zodResolver(importationFormSchema),
  })
  const { setData, setColumnItem, setColumns } = useImportation()

  const { handleSubmit, register, watch } = importationForm

  const optionSelect = watch('template')

  async function handleImport(data: ImportationFormData) {
    // console.log(data)
    const formData = new FormData()
    formData.append('file', data.file[0])
    formData.append('type', optionSelect)
    formData.append('clientId', '1')

    const response = await api
      .patch('/excel/read', formData)
      .then((res) => res.data)

    setData(response.data)
    setColumns(response.columns)
    setColumnItem(response.columnsItem)
    // setRows(response.data)
    // setChildren(response.children)

    // response.pop()
    // console.log(response)
    // setTimeout(() => {
    //   const data = response
    //   console.log(data)
    //   // data.pop()
    //   // setRows([])
    //   setRows([data[0], data[1]])
    // }, 10000)
  }

  return (
    <PageHeader>
      <FormProvider {...importationForm}>
        <form
          className="flex w-full justify-between gap-3"
          onSubmit={handleSubmit(handleImport)}
        >
          <div className="flex gap-3">
            <Form.Field>
              <Form.Label htmlFor="template">
                Oque você vai importar:
              </Form.Label>
              <Form.Select
                id="template"
                name="template"
                options={[
                  { label: 'Contrato', value: 'contract' },
                  { label: 'Equipamento', value: 'equipment' },
                ]}
              />
              <Form.ErrorMessage field="template" />
            </Form.Field>

            <Button type="button" disabled={!optionSelect}>
              <a
                href={`/template-importation/template_${optionSelect}.xlsx`}
                download
              >
                Template
              </a>
            </Button>

            <Button asChild>
              <label>
                <Upload size={16} />
                Importar
                <input
                  {...register('file')}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                />
              </label>
            </Button>
            <Form.ErrorMessage field="file" />
          </div>

          <Button>
            <FolderSync size={16} />
            Processar
          </Button>
        </form>
      </FormProvider>
    </PageHeader>
  )
}

'use client'

import { Form } from '@/components/form'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { useActives } from '@/store/smartlist/actives'
import { Plus, Save, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

export function StepSeven() {
  const { components, selects } = useActives()
  const { control, watch, setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'components',
  })

  async function handleRemoveComponent(index: number) {
    remove(index)
  }

  useEffect(() => {
    if (!components) return
    setValue('components', components)
  }, [components])

  console.log(components)

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      <h2 className="text-xl font-semibold text-slate-600">Componentes</h2>
      <div className="h-px w-full bg-slate-200" />
      <Accordion type="multiple">
        {fields.map((field, index) => {
          const description = watch(`components.${index}.description`)
          const isCreated = !!description

          return (
            <AccordionItem value={field.id} key={field.id}>
              <AccordionTrigger>
                {description || `Componente ${index + 1}`}
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-3">
                <Form.Field>
                  <Form.Label htmlFor={`components.${index}.description`}>
                    Descrição:
                  </Form.Label>
                  <Form.Input
                    name={`components.${index}.description`}
                    id={`components.${index}.description`}
                    value={description}
                  />
                  <Form.ErrorMessage
                    field={`components.${index}.description`}
                  />
                </Form.Field>

                <Form.Field>
                  <Form.Label htmlFor={`components.${index}.image`}>
                    Foto:
                  </Form.Label>
                  <Form.ImagePicker
                    name={`components.${index}.image`}
                    id={`components.${index}.image`}
                  />
                  <Form.ErrorMessage field={`components.${index}.image`} />
                </Form.Field>

                <Form.Field>
                  <Form.Label htmlFor={`components.${index}.manufacturer`}>
                    Fabricante:
                  </Form.Label>
                  <Form.Input
                    name={`components.${index}.manufacturer`}
                    id={`components.${index}.manufacturer`}
                  />
                  <Form.ErrorMessage
                    field={`components.${index}.manufacturer`}
                  />
                </Form.Field>

                <Form.Field>
                  <Form.Label htmlFor={`components.${index}.model`}>
                    Modelo:
                  </Form.Label>
                  <Form.Input
                    name={`components.${index}.model`}
                    id={`components.${index}.model`}
                  />
                  <Form.ErrorMessage field={`components.${index}.model`} />
                </Form.Field>

                <Form.Field>
                  <Form.Label htmlFor={`components.${index}.serialNumber`}>
                    N° de serie:
                  </Form.Label>
                  <Form.Input
                    name={`components.${index}.serialNumber`}
                    id={`components.${index}.serialNumber`}
                  />
                  <Form.ErrorMessage
                    field={`components.${index}.serialNumber`}
                  />
                </Form.Field>

                <Form.Field>
                  <Form.Label htmlFor={`components.${index}.manufacturingYear`}>
                    Ano de Fabricação:
                  </Form.Label>
                  <Form.Input
                    name={`components.${index}.manufacturingYear`}
                    id={`components.${index}.manufacturingYear`}
                  />
                  <Form.ErrorMessage
                    field={`components.${index}.manufacturingYear`}
                  />
                </Form.Field>

                {selects.componentStatus ? (
                  <Form.Field>
                    <Form.Label htmlFor={`components.${index}.status`}>
                      Status:
                    </Form.Label>
                    <Form.Select
                      id={`components.${index}.status`}
                      name={`components.${index}.status`}
                      options={selects.componentStatus}
                    />
                    <Form.ErrorMessage field={`components.${index}.status`} />
                  </Form.Field>
                ) : (
                  <Form.SkeletonField />
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemoveComponent(index)}
                    className="flex-1"
                  >
                    <Trash2 size={16} />
                    Remover
                  </Button>
                  {isCreated && (
                    <Button type="button" className="flex-1">
                      <Save size={16} />
                      Salvar
                    </Button>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <Form.ErrorMessage field="components" />

      <Button variant="outline" type="button" onClick={() => append({})}>
        <Plus size={16} />
        Adicionar Componente
      </Button>
    </div>
  )
}

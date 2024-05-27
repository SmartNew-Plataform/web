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
import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { ComponentForm } from './component-form'

export function StepSeven() {
  const { components, selects } = useActives()
  const { control, watch } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'components',
  })

  async function handleRemoveComponent(index: number) {
    remove(index)
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto">
      {components && (
        <>
          <span className="text-lg font-bold uppercase text-slate-900">
            Componentes cadastrados
          </span>
          <div className="h-px w-full bg-slate-200" />
          <Accordion type="multiple" className="mb-6">
            {components.map((component) => {
              return (
                <AccordionItem
                  value={component.id.toString()}
                  key={component.id}
                >
                  <AccordionTrigger className="text-slate-500">
                    {component.description}
                  </AccordionTrigger>

                  <AccordionContent className="flex flex-col gap-3">
                    <ComponentForm defaultValues={component} />
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </>
      )}
      <span className="text-lg font-bold uppercase text-slate-900">
        Componentes novos
      </span>
      <div className="h-px w-full bg-slate-200" />
      <Accordion type="multiple">
        {fields.map((field, index) => {
          const description = watch(`components.${index}.description`)

          return (
            <AccordionItem value={field.id} key={field.id}>
              <AccordionTrigger className="text-slate-500">
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
                    type="number"
                    min="1900"
                    max="2099"
                    step="1"
                    value={new Date().getFullYear()}
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

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveComponent(index)}
                  className="flex-1"
                >
                  <Trash2 size={16} />
                  Remover
                </Button>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <Form.ErrorMessage field="components" />

      <Button
        variant="outline"
        type="button"
        onClick={() =>
          append({
            description: `Componente ${fields.length + 1}`,
            manufacturer: null,
            model: null,
            serialNumber: null,
            manufacturingYear: null,
            status: 'Ativo',
          })
        }
      >
        <Plus size={16} />
        Adicionar Componente
      </Button>
    </div>
  )
}

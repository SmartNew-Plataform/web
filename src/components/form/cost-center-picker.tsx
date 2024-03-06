import { useQuery } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { ComponentProps, useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { Button } from '../ui/button'
import { Combobox } from '../ui/combobox'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet'

interface CostCenterPickerProps extends ComponentProps<typeof Button> {
  name: string
}

type NodeData = {
  label: string
  value: string
  children?: NodeData[]
}

export function CostCenterPicker({
  name,
  className,
  ...props
}: CostCenterPickerProps) {
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
  })
  const [branch, setBranch] = useState<string>()
  const [currentLabel, setCurrentLabel] = useState<string | undefined>()

  const { data } = useQuery({
    queryKey: ['@cost-center-combobox'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return {
        branch: Array.from({ length: 3 }).map((_, i) => ({
          label: i.toString(),
          value: i.toString(),
        })),

        list: Array.from({ length: 3 }).map((_, i) => ({
          label: `Descrição ${i + 1}`,
          value: i.toString(),
          children: Array.from({ length: 4 }).map((_, i) => ({
            label: `Centro de custo ${i + 1}`,
            value: i.toString(),
            children: Array.from({ length: 4 }).map((_, i) => ({
              label: `Composição ${i + 1}`,
              value: i.toString(),
              children: Array.from({ length: 4 }).map((_, i) => ({
                label: `Composição item ${i + 1}`,
                value: i.toString(),
              })),
            })),
          })),
        })),
      }
    },
  })

  function handleSelectItem(item: NodeData) {
    field.onChange(item.value)
    setCurrentLabel(item.label)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className={twMerge('justify-start', className)}
          {...props}
        >
          {field.value ? (
            <span className="font-normal normal-case">{currentLabel}</span>
          ) : (
            <span className="font-medium normal-case text-zinc-500">
              Selecione...
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="space-y-4">
        <SheetTitle>Selecione um centro de custo</SheetTitle>

        <Combobox
          value={branch}
          onValueChange={setBranch}
          options={data?.branch || []}
          className="w-full"
        />

        <div className="flex h-full w-full flex-col gap-4 overflow-auto">
          <Accordion type="single" collapsible>
            {data?.list.map((description) => {
              return (
                <AccordionItem
                  key={description.value}
                  value={description.value}
                >
                  <AccordionTrigger>{description.label}</AccordionTrigger>
                  <AccordionContent>
                    <Accordion type="single" collapsible>
                      {description.children.map((costCenter) => {
                        return (
                          <AccordionItem
                            key={costCenter.value}
                            value={costCenter.value}
                            className="mb-2 rounded bg-slate-200 px-2"
                          >
                            <AccordionTrigger>
                              {costCenter.label}
                            </AccordionTrigger>
                            <AccordionContent>
                              <Accordion type="single" collapsible>
                                {costCenter.children.map((compositionGroup) => {
                                  return (
                                    <AccordionItem
                                      key={compositionGroup.value}
                                      value={compositionGroup.value}
                                      className="mb-2 rounded bg-slate-300/80 px-2"
                                    >
                                      <AccordionTrigger className="w-full justify-between gap-4">
                                        {compositionGroup.label}
                                      </AccordionTrigger>
                                      <AccordionContent>
                                        {compositionGroup.children.map(
                                          (compositionItem) => {
                                            return (
                                              <button
                                                type="button"
                                                className="group flex w-full items-center justify-between gap-2 p-2 transition-colors hover:bg-slate-400/30 data-[checked=true]:bg-slate-400/30"
                                                onClick={() =>
                                                  handleSelectItem(
                                                    compositionItem,
                                                  )
                                                }
                                                key={compositionItem.value}
                                                data-checked={
                                                  field.value ===
                                                  compositionItem.value
                                                }
                                              >
                                                {compositionItem.label}

                                                <Check
                                                  size={16}
                                                  className="hidden group-data-[checked=true]:inline"
                                                />
                                              </button>
                                            )
                                          },
                                        )}
                                      </AccordionContent>
                                    </AccordionItem>
                                  )
                                })}
                              </Accordion>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  )
}

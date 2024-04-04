'use client'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Check, SquareArrowOutUpRight } from 'lucide-react'
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
import { ComboboxMulti } from '../ui/combobox-multi'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet'

interface CostCenterPickerProps extends ComponentProps<typeof Button> {
  name: string
  value?: string
  defaultLabel?: string
}

type NodeData = {
  label: string
  value: string
  children?: NodeData[]
}

export function CostCenterPicker({
  name,
  className,
  value,
  defaultLabel,
  ...props
}: CostCenterPickerProps) {
  const { control } = useFormContext()
  const { field } = useController({
    name,
    control,
    defaultValue: value,
  })
  const [branch, setBranch] = useState<string[]>([''])
  const [currentLabel, setCurrentLabel] = useState<string | undefined>(
    defaultLabel,
  )

  const { data: listBranch } = useQuery({
    queryKey: ['list-branch'],
    queryFn: async () => {
      const response = await api
        .get('system/list-branch')
        .then((res) => res.data)

      return response.data
    },
  })

  const { data } = useQuery<NodeData[]>({
    queryKey: ['cost-center-combobox', ...branch],
    queryFn: async () => {
      if (!branch.length) return []
      const response = await api
        .get('system/description-cost-center', {
          params: {
            branchId: branch,
          },
        })
        .then((res) => res.data)

      return response.data
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
            <span className="flex-1 text-left font-normal normal-case">
              {currentLabel}
            </span>
          ) : (
            <span className="flex-1 text-left font-medium normal-case text-zinc-500">
              Selecione...
            </span>
          )}

          <SquareArrowOutUpRight size={12} className="text-zinc-500" />
        </Button>
      </SheetTrigger>

      <SheetContent className="space-y-4">
        <SheetTitle>Selecione um centro de custo</SheetTitle>

        <ComboboxMulti
          value={branch}
          onValueChange={setBranch}
          options={listBranch}
          className="w-full"
        />

        <div className="flex h-full w-full flex-col gap-4 overflow-auto">
          <Accordion type="single" collapsible>
            {data ? (
              data.map((description) => {
                return (
                  <AccordionItem
                    key={description.value}
                    value={description.value}
                  >
                    <AccordionTrigger>{description.label}</AccordionTrigger>
                    <AccordionContent>
                      <Accordion type="single" collapsible>
                        {description.children &&
                          description.children.map((costCenter: NodeData) => {
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
                                    {costCenter?.children &&
                                      costCenter?.children.map(
                                        (compositionGroup) => {
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
                                                {compositionGroup.children &&
                                                  compositionGroup.children.map(
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
                                                          key={
                                                            compositionItem.value
                                                          }
                                                          data-checked={
                                                            field.value ===
                                                            compositionItem.value
                                                          }
                                                        >
                                                          {
                                                            compositionItem.label
                                                          }

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
                                        },
                                      )}
                                  </Accordion>
                                </AccordionContent>
                              </AccordionItem>
                            )
                          })}
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                )
              })
            ) : (
              <span>sem centro de custo</span>
            )}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  )
}

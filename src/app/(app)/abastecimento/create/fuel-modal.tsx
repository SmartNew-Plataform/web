'use client'
import { SelectData } from '@/@types/select-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Pencil, Plus, Trash } from 'lucide-react'
import { ComponentProps } from 'react'
import { z } from 'zod'

const createActiveFormSchema = z.object({})

export type ActiveFormData = z.infer<typeof createActiveFormSchema>

interface ActiveFormProps extends ComponentProps<typeof Sheet> {
  tankId: string
}

export function FuelModal({ tankId, ...props }: ActiveFormProps) {
  async function fetchCategory() {
    const response = await api
      .get(`fuelling/tank/${tankId}`)
      .then((response) => response.data)
    return response.data.compartment
  }

  const { data } = useQuery<SelectData[]>({
    queryKey: ['fuelling/tank', tankId],
    queryFn: fetchCategory,
  })

  return (
    <Sheet {...props}>
      <SheetContent className="flex max-h-screen w-1/4 flex-col overflow-x-hidden">
        <div className="mt-4 flex items-end justify-between border-b border-zinc-200 pb-4">
          <SheetTitle>Compartimentos</SheetTitle>
          <Button>
            <Plus size={16} />
            Novo
          </Button>
        </div>
        <div className="flex h-full flex-col gap-4 overflow-auto">
          {data?.map(({ label, value }) => {
            return (
              <Card key={value}>
                <CardContent className="relative pt-5">
                  <p>{label}</p>
                  <div className="absolute right-4 top-4 flex gap-2">
                    <Button variant="destructive" size="icon-sm">
                      <Trash size={14} />
                    </Button>
                    <Button variant="secondary" size="icon-sm">
                      <Pencil size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}

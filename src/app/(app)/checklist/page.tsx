'use client'
import { CardStatus } from '@/components/CardStatus'
import { Bar } from '@/components/Charts/Bar'
import { Donut } from '@/components/Charts/Donut'
import { Form } from '@/components/Form'
import { LoadingPage } from '@/components/LoadingPage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDashboardChecklistStore } from '@/store/dashboard-checklist-store'
import { useUserStore } from '@/store/user-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, ListFilter, SlidersHorizontal } from 'lucide-react'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const filterSchema = z.object({
  period: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
  branch: z.array(z.string()).optional(),
  active: z.array(z.string()).optional(),
})

type FilterSchemaType = z.infer<typeof filterSchema>

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = true

export default function Home() {
  const {
    load,
    searchData,
    summaryCards,
    equipment,
    branch,
    fillEquipmentsByBranch,
  } = useDashboardChecklistStore()
  const { user } = useUserStore(({ user }) => ({ user }))
  const branchOptions = branch?.length
    ? branch?.map(({ id, corporateName }) => ({
        value: String(id),
        label: corporateName,
      }))
    : []

  const filterForm = useForm<FilterSchemaType>({
    resolver: zodResolver(filterSchema),
  })
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = filterForm

  const allBranches = watch('branch')

  const equipmentOptions = equipment?.length
    ? equipment?.map(({ id, description, code }) => ({
        value: String(id),
        label: `${code} - ${description}`,
      }))
    : []

  async function handleFilter(data: FilterSchemaType) {
    if (!user) return
    await searchData({ ...data, login: user.login })
  }

  useEffect(() => {
    fillEquipmentsByBranch(allBranches || [''])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBranches])

  useEffect(() => {
    if (!user) return
    load(user?.login)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className="flex h-full w-full flex-col gap-4 bg-zinc-50 p-4">
      <Card className="flex w-full items-center justify-between gap-4 rounded-md p-4">
        <h1 className="hidden bg-gradient-to-r from-violet-500 to-violet-600 bg-clip-text font-extrabold text-transparent sm:inline sm:text-lg md:text-2xl">
          Dashboard Checklist
        </h1>

        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="gap-3">
                <SlidersHorizontal className="h-4 w-4" color="#fff" />
                Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <FormProvider {...filterForm}>
                <form
                  onSubmit={handleSubmit(handleFilter)}
                  className="flex flex-col gap-4"
                >
                  <Form.Field>
                    <Form.Label htmlFor="period">Período</Form.Label>
                    <Form.InputDateRange id="period" name="period" />
                  </Form.Field>

                  <Form.Field>
                    <Form.Label>Filial</Form.Label>
                    <Form.MultiSelect name="branch" options={branchOptions} />
                  </Form.Field>

                  <Form.Field>
                    <Form.Label>Ativo</Form.Label>
                    <Form.MultiSelect
                      name="active"
                      options={equipmentOptions}
                    />
                  </Form.Field>

                  <Button
                    className="gap-3"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <ListFilter className="h-4 w-4" color="#fff" />
                    Filtrar
                  </Button>
                </form>
              </FormProvider>
            </PopoverContent>
          </Popover>

          <Button variant="secondary">
            <FileText className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </Card>

      {isSubmitting ? (
        <LoadingPage message="Carregando dados do dashboard..." />
      ) : (
        <main className="flex flex-1 flex-col gap-5">
          <div className="grid grid-cols-auto gap-4">
            {summaryCards?.map(({ color, description, icon, id, quantity }) => {
              return (
                <CardStatus
                  key={id}
                  icon={icon}
                  label={description}
                  quantity={quantity}
                  color={color}
                />
              )
            })}
          </div>

          <div className="grid grid-cols-auto gap-4">
            <Card>
              <CardContent>
                <Bar />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Donut />
              </CardContent>
            </Card>
          </div>
        </main>
      )}
    </div>
  )
}

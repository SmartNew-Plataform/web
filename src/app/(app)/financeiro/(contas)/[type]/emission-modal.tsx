'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useAccountStore } from '@/store/financial/account'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { GroupCard } from './group-card'
import { GroupForm } from './group-form'
import { Button } from '@/components/ui/button'
import { Wallet2 } from 'lucide-react'

export type PaymentData = {
  dueDate: string
  provider: string
  value: number
  id: number
}

export type BankData = {
  id: number
  name: string
  balance: number
}

type GroupsData = {
  group: Array<{
    pay: boolean
    dueDate: string
    id: number
    bankId: number
    payment: Array<PaymentData>
  }>
  withOut: Array<PaymentData>
}

export function EmissionModal() {
  const { selectedRows } = useAccountStore()

  async function fetchDataGroups() {
    const response = await api
      .get('/financial/account/find-emission', {
        params: {
          splitId: selectedRows.map(({ id }) => id),
        },
      })
      .then((res) => res.data)

    return response
  }

  const { data, refetch, isLoading, isFetching } = useQuery<GroupsData>(
    ['financial-emission-groups'],
    fetchDataGroups,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
    },
  )

  useEffect(() => {
    refetch()
  }, [selectedRows])

  const groups = data?.group.map((item) => {
    return {
      ...item,
      totalItems: item.payment.reduce((acc, { value }) => acc + value, 0),
    }
  })
  const withoutEmissionGroup = data?.withOut || []
  const withoutTotalItems =
    data?.withOut.reduce((acc, { value }) => acc + value, 0) || 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Wallet2 width={16} />
          Controle emissão
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[98vh] max-w-2xl flex-col gap-4 text-lg">
        {!data || isLoading || isFetching ? (
          <>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </>
        ) : (
          <div className="w-full overflow-auto">
            <Accordion type="multiple" className="flex w-full flex-col gap-4">
              {withoutEmissionGroup.length > 0 && (
                <AccordionItem
                  value="without-emission-group"
                  className="border-none p-0"
                >
                  <AccordionTrigger className="my-4 rounded-md border border-slate-200 bg-slate-100 p-4 font-semibold uppercase">
                    NÃO EMITIDOS
                  </AccordionTrigger>
                  <AccordionContent className="flex w-full gap-4 pt-4">
                    <div className="flex flex-1 flex-col gap-4 divide-y divide-slate-400">
                      {withoutEmissionGroup?.map((item, i, arr) => {
                        return (
                          <GroupCard
                            key={i}
                            {...item}
                            length={arr.length}
                            index={i}
                            emitted={false}
                          />
                        )
                      })}
                    </div>
                    <GroupForm
                      emitted={false}
                      totalItems={withoutTotalItems}
                      paid={false}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}

              {groups?.map(
                ({ payment, pay, bankId, totalItems, id, dueDate }) => (
                  <AccordionItem
                    key={id}
                    value={`group-${id}`}
                    className="border-none p-0"
                  >
                    <AccordionTrigger className="rounded-md border border-slate-200 bg-slate-100 p-4 font-semibold uppercase">
                      GRUPO {id}
                    </AccordionTrigger>
                    <AccordionContent className="flex w-full gap-4 pt-4">
                      <div className="flex flex-1 flex-col gap-4 divide-y divide-slate-400">
                        {payment.map((item, i, arr) => {
                          return (
                            <GroupCard
                              key={i}
                              {...item}
                              length={arr.length}
                              index={i}
                              emitted
                              emissionId={id}
                            />
                          )
                        })}
                      </div>
                      <GroupForm
                        emitted
                        bankId={bankId}
                        paid={pay}
                        groupId={id}
                        totalItems={totalItems}
                        dueDate={dueDate}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ),
              )}
            </Accordion>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

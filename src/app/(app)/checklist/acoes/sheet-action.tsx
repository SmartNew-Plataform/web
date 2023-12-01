'use client'
import { Form } from '@/components/form'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ActionItem, useActionsStore } from '@/store/smartlist/actions'
import { useQueryClient } from '@tanstack/react-query'
import { ComponentProps, useEffect, useState } from 'react'
import { FormAction } from './form-action'
import { GroupedEquipments } from './grouped-equipments'

type SheetActionProps = ComponentProps<typeof Sheet>

export type InfoData = {
  id: number
  code: number
  equipment: Array<string>
  branch: Array<string>
  responsible: {
    login: string
    name: string
  }
  title: string
  endDate: string
  doneAt: string
  description: string
  descriptionAction: string
  status: string
}

type ActionFormType = {
  description: string
  responsible: string
  deadline: Date
  attach: File[]
  doneAt?: Date | undefined
  descriptionAction?: string | undefined
}

export type ItemData = {
  id: number
  task: string
  equipment: string
  branch: string
  startDate: string
}

type AllDataType = {
  info?: InfoData
  items?: Array<ItemData>
}

export function SheetAction(props: SheetActionProps) {
  const { currentTask, setSearchOption } = useActionsStore()
  const [data, setData] = useState<AllDataType>()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function getDataGroupRegistered(taskId: number) {
    const response = await api
      .get(`/smart-list/action/group/${taskId}`)
      .then((res) => res.data)

    setData(response)
  }

  async function getDataGroupUnregistered(taskId: number) {
    const response = await api
      .get(`/smart-list/action/item/${taskId}`)
      .then((res) => res.data)

    setData(response)
  }

  async function handleCreateAction(dataForm: ActionFormType) {
    setSearchOption('with-action')
    const response: ActionItem = await api
      .post('smart-list/action/group', {
        itemsId: data?.items ? data.items.map(({ id }) => id) : [],
        ...dataForm,
      })
      .then((res) => res.data)

    setSearchOption('without-action')

    // const previousGroups = queryClient.getQueryData<ActionItem[]>([
    //   'ungrouped-table',
    // ])
    // console.log(previousGroups)

    // if (previousGroups) {
    //   const nextGroups = previousGroups.filter(
    //     (group) => group.id !== response.id,
    //   )
    //   console.log(nextGroups)

    //   queryClient.setQueryData(['ungrouped-table'], nextGroups)
    // }

    toast({
      title: 'Itens agrupados com sucesso!',
      variant: 'success',
    })
  }

  async function handleUpdateAction(data: ActionFormType) {
    console.log(data)

    // try {
    //   const response = await api
    //     .put('smart-list/action', {
    //       itemId: currentTask?.id,
    //       actionId: currentTask?.actionId,
    //       ...data,
    //     })
    //     .then((res) => res.data)

    //   Array.from(data.attach).forEach(async (image) => {
    //     const formData = new FormData()
    //     formData.append('file', image)
    //     const responseAttach = await api
    //       .post(
    //         `smart-list/action/insert-attach/${currentTask?.actionId}`,
    //         formData,
    //       )
    //       .then((res) => res.data)

    //     if (responseAttach?.inserted)
    //       toast({
    //         title: 'Erro ao inserir imagem!',
    //         description: image.name,
    //         variant: 'destructive',
    //       })
    //   })

    //   queryClient.invalidateQueries(['action-table'])

    //   fetchAttach(currentTask!.actionId!)
    //   setCurrentTask(response)
    //   setValue('attach', [])
    //   toast({
    //     title: 'Ação atualizada com sucesso!',
    //     variant: 'success',
    //   })
    // } catch (error) {
    //   console.error(error)
    // }
  }

  const handleSubmit = data?.info?.code
    ? handleUpdateAction
    : handleCreateAction

  useEffect(() => {
    setData({})
    if (!currentTask?.taskId) return
    if (currentTask?.code) {
      getDataGroupRegistered(currentTask.taskId)
      return
    }
    getDataGroupUnregistered(currentTask.taskId)
  }, [currentTask])

  return (
    <Sheet {...props}>
      <SheetContent
        side="bottom"
        className="h-full max-h-[90vh] overflow-auto pb-0"
      >
        <div className="flex h-full  w-full justify-center gap-4">
          {data?.info ? (
            <FormAction
              dataTask={data.info}
              handleSubmitGroupForm={handleSubmit}
            />
          ) : (
            <div className="my-6 flex w-full max-w-sm flex-col gap-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <Form.SkeletonField key={i} />
              ))}
            </div>
          )}
          {data?.items ? (
            <GroupedEquipments data={data.items} />
          ) : (
            <div className="my-6 flex w-full max-w-sm flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton className="h-24" key={i} />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

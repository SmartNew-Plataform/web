'use client'
import { Form } from '@/components/form'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Sheet } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ActionItem, useActionsStore } from '@/store/smartlist/actions'
import { useQueryClient } from '@tanstack/react-query'
import { ComponentProps, useEffect, useState } from 'react'
import { FormAction } from './form-action'
import { GroupedEquipments } from './grouped-equipments'

type DialogActionProps = ComponentProps<typeof Sheet>

export type InfoData = {
  id: number
  code: number
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

export function DialogAction(props: DialogActionProps) {
  const { currentTask, fetchAttach } = useActionsStore()
  const [data, setData] = useState<AllDataType>()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function getDataGroupRegistered(taskId: number) {
    const response = await api
      .get(`/smart-list/action/group/${taskId}`)
      .then((res) => res.data)

    fetchAttach(taskId)
    setData(response)
  }

  async function getDataGroupUnregistered(taskId: number) {
    const response = await api
      .get(`/smart-list/action/item/${taskId}`)
      .then((res) => res.data)

    setData(response)
  }

  async function handleCreateAction(dataForm: ActionFormType) {
    await api
      .post('smart-list/action/group', {
        itemsId: data?.items ? data.items.map(({ id }) => id) : [],
        ...dataForm,
      })
      .then((res) => res.data)

    const previousGroups = queryClient.getQueryData<{
      rows: ActionItem[]
      pageCount: number
    }>(['ungrouped-table'])

    if (previousGroups) {
      const nextGroups = previousGroups.rows.filter(
        (group) => group.id !== currentTask!.taskId,
      )

      queryClient.setQueryData(['ungrouped-table'], {
        rows: nextGroups,
        pageCount: previousGroups.pageCount,
      })
    }

    toast({
      title: 'Itens agrupados com sucesso!',
      variant: 'success',
    })
  }

  async function handleUpdateAction(data: ActionFormType) {
    try {
      const response = await api
        .put(`smart-list/action/group/${currentTask!.taskId}`, {
          ...data,
        })
        .then((res) => res.data)

      Array.from(data.attach).forEach(async (image) => {
        const formData = new FormData()
        formData.append('file', image)
        const responseAttach = await api
          .post(
            `smart-list/action/insert-attach/${currentTask?.taskId}`,
            formData,
          )
          .then((res) => res.data)

        if (responseAttach?.inserted)
          toast({
            title: 'Erro ao inserir imagem!',
            description: image.name,
            variant: 'destructive',
          })
      })

      const previousGroups = queryClient.getQueryData<{
        rows: ActionItem[]
        pageCount: number
      }>(['grouped-table'])

      if (previousGroups) {
        const nextGroups = previousGroups.rows.map((group) => {
          if (group.id === response.id) {
            return response
          } else return group
        })

        queryClient.setQueryData(['grouped-table'], {
          rows: nextGroups,
          pageCount: previousGroups.pageCount,
        })
      }

      fetchAttach(currentTask!.taskId)
      toast({
        title: 'Ação atualizada com sucesso!',
        variant: 'success',
      })
    } catch (error) {
      console.error(error)
    }
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
    <Dialog {...props}>
      <DialogContent className="flex h-[90vh] w-full max-w-4xl flex-col overflow-auto pb-0">
        <div className="flex h-full w-full justify-center gap-4">
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
      </DialogContent>
    </Dialog>
  )
}

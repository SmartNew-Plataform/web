'use client'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ComponentProps, useEffect, useState } from 'react'
import { FormAction } from './form-action'
import { ActionItem, useActionsStore } from '@/store/smartlist/actions'
import { api } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'

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

type ItemData = {
  id: number
  task: string
  equipment: string
  branch: string
}

type AllDataType = {
  info?: InfoData
  items?: Array<ItemData>
}

export function SheetAction(props: SheetActionProps) {
  const { currentTask, selectedTasks, updateSelectedTasks } = useActionsStore()
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
    // const response = await api.get(`/smart-list/action/group/${taskId}`).then(res => res.data)

    setData({})
  }

  async function handleCreateAction(data: ActionFormType) {
    console.log(data)

    // const response: ActionItem = await api
    //   .post('smart-list/action/group', {
    //     itemsId: selectedTasks.map(Number),
    //     ...data,
    //   })
    //   .then((res) => res.data)

    // queryClient.invalidateQueries(['action-table'])
    // updateSelectedTasks([])
    // toast({
    //   title: 'Itens agrupados com sucesso!',
    //   variant: 'success',
    // })
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
    if (!currentTask?.taskId) return
    if (currentTask?.code) {
      getDataGroupRegistered(currentTask.taskId)
    }
    getDataGroupUnregistered(currentTask.taskId)
  }, [currentTask])

  return (
    <Sheet {...props}>
      <SheetContent side="bottom" className="overflow-auto pb-0">
        <div className="flex max-h-[90vh] w-full justify-center gap-4">
          {data?.info ? (
            <FormAction
              dataTask={data.info}
              handleSubmitGroupForm={handleSubmit}
            />
          ) : (
            <p>carregando...</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

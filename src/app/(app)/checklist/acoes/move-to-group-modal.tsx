'use client'
import { Form } from '@/components/form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useActionsStore } from '@/store/smartlist/actions'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { ComponentProps } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

const moveGroupFormSchema = z.object({
  group: z.string({ required_error: 'Selecione um grupo!' }),
})

type MoveGroupFormData = z.infer<typeof moveGroupFormSchema>

type MoveToGroupModalProps = ComponentProps<typeof Dialog>

export function MoveToGroupModal({ ...props }: MoveToGroupModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const groupForm = useForm<MoveGroupFormData>()
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = groupForm
  const { selectedTasks, groups, updateSelectedTasks } = useActionsStore(
    ({ selectedTasks, groups, updateSelectedTasks }) => ({
      selectedTasks,
      updateSelectedTasks,
      groups: groups
        ? groups.map(({ id, title }) => ({
            label: title,
            value: String(id),
          }))
        : undefined,
    }),
  )

  async function handleMoveToGroup(data: MoveGroupFormData) {
    await api.post(`smart-list/action/group/${data.group}`, {
      itemsId: selectedTasks.map(Number),
    })

    updateSelectedTasks([])
    const test = await queryClient.invalidateQueries(['action-table'])
    console.log(test)

    toast({
      variant: 'success',
      title: 'Item(s) movido(s) com sucesso!',
    })
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogTitle>Mover item para um grupo</DialogTitle>
        <FormProvider {...groupForm}>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleMoveToGroup)}
          >
            {groups ? (
              <Form.Field>
                <Form.Label>Selecione o grupo:</Form.Label>
                <Form.Select name="group" options={groups} />
                <Form.ErrorMessage field="group" />
              </Form.Field>
            ) : (
              <>
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-10" />
              </>
            )}

            <Button loading={isSubmitting}>
              Mover itens
              <ArrowRight />
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

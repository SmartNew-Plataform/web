import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog'
import { Pencil, Save, Trash, Trash2, Undo } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SituationForm } from './situation-form'

interface TaskProps {
  id: string
  description: string
  loadTasks: () => Promise<void>
}

const taskFormSchema = z.object({
  description: z.string().nonempty({ message: 'A descrição e obrigatoria!' }),
})

type TaskFormData = z.infer<typeof taskFormSchema>

export function Task({ id, description, loadTasks }: TaskProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
  })
  const [loadingDelete, setLoadingDelete] = useState(false)

  const { toast } = useToast()

  async function handleEditTask(data: TaskFormData) {
    await api.put(`/smart-list/task/${id}`, data).then((res) => res.data)
    toast({ variant: 'success', title: 'Task atualizada com sucesso!' })
    loadTasks()
  }

  async function handleDeleteTask() {
    setLoadingDelete(true)
    await api.delete(`/smart-list/task/${id}`)
    toast({ variant: 'success', title: 'Task deletada com sucesso!' })
    loadTasks()
    setLoadingDelete(false)
  }

  return (
    <Card className="flex flex-col justify-between p-4">
      <div className="flex gap-2 self-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="icon-sm">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-full overflow-auto">
            <Tabs defaultValue="ask" className="h-full w-full">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="ask">
                  Pergunta
                </TabsTrigger>
                <TabsTrigger className="w-full" value="action">
                  Situação
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ask" className="h-full">
                <form
                  className="mt-4 flex w-full flex-col gap-2"
                  onSubmit={handleSubmit(handleEditTask)}
                >
                  <Label>Descrição</Label>
                  <Input
                    {...register('description')}
                    defaultValue={description}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-6" />
                    Salvar task
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="action">
                <SituationForm taskId={id} />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon-sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader className="mb-6">
              <AlertDialogTitle>
                Cereteza que deseja deletar essa task ?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Button variant="outline">
                  <Undo className="h-4 w-4" />
                  Cancelar
                </Button>
              </AlertDialogCancel>
              <Button
                variant="destructive"
                loading={loadingDelete}
                disabled={loadingDelete}
                onClick={handleDeleteTask}
              >
                <Trash className="h-4 w-4" />
                Sim, deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className="max-w-full flex-1 truncate">{description}</span>
        </TooltipTrigger>
        <TooltipContent>{description}</TooltipContent>
      </Tooltip>
    </Card>
  )
}

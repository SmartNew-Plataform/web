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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog'
import { Pencil, Save, Trash, Undo } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
  })

  const { toast } = useToast()

  async function handleEditTask(data: TaskFormData) {
    await api.put(`/task/${id}`, data).then((res) => res.data)
    toast({ variant: 'success', title: 'Task atualizada com sucesso!' })
    loadTasks()
  }

  async function handleDeleteTask() {
    await api.delete(`/task/${id}`)
    toast({ variant: 'success', title: 'Task deletada com sucesso!' })
    loadTasks()
  }

  return (
    <Card className="flex justify-between p-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="max-w-full flex-1 truncate">{description}</span>
        </TooltipTrigger>
        <TooltipContent>{description}</TooltipContent>
      </Tooltip>

      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form
              className="mt-4 flex w-full flex-col gap-2"
              onSubmit={handleSubmit(handleEditTask)}
            >
              <Label>Descrição</Label>
              <Input {...register('description')} defaultValue={description} />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
              <Button type="submit">
                <Save className="h-4 w-6" />
                Salvar task
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash className="h-4 w-4" />
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
              <Button variant="destructive" onClick={handleDeleteTask}>
                <Trash className="h-4 w-4" />
                Sim, deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  )
}

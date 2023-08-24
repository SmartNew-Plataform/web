'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TaskData } from './page'

interface FormNewTaskProps {
  setTasks: (arg: SetStateAction<TaskData[]>) => void
}

const taskFormSchema = z.object({
  description: z.string().nonempty({ message: 'A descrição e obrigatoria!' }),
})

type TaskFormData = z.infer<typeof taskFormSchema>

export function FormNewTask({ setTasks }: FormNewTaskProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
  })
  const { toast } = useToast()

  async function handleCreateTask(data: TaskFormData) {
    const response = await api.post('/task', data).then((res) => res.data)
    setTasks((allTasks) => [...allTasks, response])
    toast({
      title: 'Task adicionada com sucesso!',
      variant: 'success',
    })
    console.log(response)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-6" />
          Criar nova task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar nova task</DialogTitle>
        </DialogHeader>

        <form
          className="mt-4 flex w-full flex-col gap-2"
          onSubmit={handleSubmit(handleCreateTask)}
        >
          <Label>Descrição</Label>
          <Input {...register('description')} />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
          <Button type="submit">
            <Plus className="h-4 w-6" />
            Cadastrar task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

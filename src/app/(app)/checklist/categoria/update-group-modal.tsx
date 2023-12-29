'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { FormGroup, GroupFormData } from './form-group'

interface UpdateGroupModalProps {
  data: {
    id: number
    name: string
    branch: number
  }
}

export function UpdateGroupModal({ data }: UpdateGroupModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const defaultValues = {
    name: data.name,
    branch: String(data.branch),
  }

  async function handleUpdateGroup(dataForm: GroupFormData) {
    try {
      await api.put(`/smart-list/diverse/${data.id}`, {
        name: dataForm.name,
      })

      await queryClient.refetchQueries(['diverse:list'])

      toast({
        title: 'Categoria atualizada com sucesso!',
        variant: 'success',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon-xs" variant="secondary">
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <FormGroup
          mode="edit"
          handleSubmitFormGroup={handleUpdateGroup}
          defaultValues={defaultValues}
        />
      </DialogContent>
    </Dialog>
  )
}

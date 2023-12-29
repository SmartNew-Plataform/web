'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { FormGroup, GroupFormData } from './form-group'

export function NewGroupModal() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleNewGroup(data: GroupFormData) {
    try {
      await api.post('/smart-list/diverse', {
        name: data.name,
        branch: Number(data.branch),
      })

      await queryClient.refetchQueries(['diverse:list'])

      // reset({
      //   branch: '',
      //   name: '',
      // })
      toast({
        title: 'Categoria criada com sucesso!',
        variant: 'success',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-3 w-3" />
          Nova categoria
        </Button>
      </DialogTrigger>

      <DialogContent>
        <FormGroup mode="create" handleSubmitFormGroup={handleNewGroup} />
      </DialogContent>
    </Dialog>
  )
}

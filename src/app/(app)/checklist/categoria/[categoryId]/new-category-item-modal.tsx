'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { FormCategoryItem, FormCategoryItemData } from './form-category-item'

interface NewCategoryItemModalProps {
  categoryId: string
}

export function NewCategoryItemModal({
  categoryId,
}: NewCategoryItemModalProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  async function handleCreateCategoryItem(data: FormCategoryItemData) {
    try {
      await api.post(`/smart-list/diverse/${categoryId}/items`, data)

      await queryClient.refetchQueries(['checklist-category-item'])

      toast({
        title: 'Item de categoria criado com sucesso!',
        variant: 'success',
      })
    } catch (error) {
      console.error(error)
    }
    console.log(data)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-3 w-3" />
          Novo Item
        </Button>
      </DialogTrigger>

      <DialogContent>
        <FormCategoryItem handleSubmitForm={handleCreateCategoryItem} />
      </DialogContent>
    </Dialog>
  )
}

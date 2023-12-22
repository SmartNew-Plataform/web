'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { FormCategoryItem, FormCategoryItemData } from './form-category-item'

interface UpdateCategoryItemModalProps {
  categoryId: string
  itemId: number
  data: FormCategoryItemData
}

export function UpdateCategoryItemModal({
  categoryId,
  itemId,
  data,
}: UpdateCategoryItemModalProps) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  async function handleUpdateCategoryItem(data: FormCategoryItemData) {
    try {
      await api.put(`/smart-list/diverse/${categoryId}/items/${itemId}`, data)

      await queryClient.refetchQueries(['checklist-category-item'])

      toast({
        title: 'Item de categoria atualizado com sucesso!',
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
        <Button size="icon-xs">
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <FormCategoryItem
          defaultValues={data}
          handleSubmitForm={handleUpdateCategoryItem}
        />
      </DialogContent>
    </Dialog>
  )
}

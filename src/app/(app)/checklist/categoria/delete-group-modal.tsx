import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { Trash, Trash2, Undo } from 'lucide-react'

interface DeleteGroupModalProps {
  categoryId: number
}

export function DeleteGroupModal({ categoryId }: DeleteGroupModalProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  async function handleDeleteCategory() {
    try {
      await api.delete(`/smart-list/diverse/${categoryId}`)

      await queryClient.refetchQueries(['diverse:list'])

      toast({
        title: 'Categoria deletada com sucesso!',
        variant: 'success',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon-xs">
          <Trash2 className="h-3 w-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="mb-6">
          <AlertDialogTitle>Certeza que deseja deletar ?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">
              <Undo className="h-4 w-4" />
              Cancelar
            </Button>
          </AlertDialogCancel>
          <Button onClick={handleDeleteCategory} variant="destructive">
            <Trash className="h-4 w-4" />
            Sim, deletar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

import { CornerDownLeft } from 'lucide-react'
import { ComponentProps } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from '../components/ui/alert-dialog'
import { Button } from './ui/button'

interface AlertModalProps extends ComponentProps<typeof AlertDialog> {
  message?: string
  onConfirm: () => void
}

export function AlertModal({
  message = 'Tem certeza que deseja deletar ?',
  onConfirm,
  ...props
}: AlertModalProps) {
  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">
              <CornerDownLeft size={16} />
              Não, cancelar
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onConfirm}>Sim, confirmar</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

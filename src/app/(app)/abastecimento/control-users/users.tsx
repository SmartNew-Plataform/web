'use client'
import { AlertModal } from '@/components/alert-modal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ProductModal } from './Primary-modal'

export interface User {
  id: number
  user: {
    value: string
    label: string
  }
  branch: {
    value: string
    label: string
  }
  type: {
    value: string
    label: string
  }
  password: string
  train?: {
    value: string
    label: string
  }
}

export function UserList() {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()

  async function fetchUsers(): Promise<User[]> {
    const response = await api.get('fuelling/control-user', {
      params: {
        s: searchParams.get('s'),
      },
    })
    return response.data.data || []
  }

  const { data: usersData = [] } = useQuery({
    queryKey: ['fuelling/control-user', searchParams.get('s')],
    queryFn: fetchUsers,
    refetchInterval: 20 * 1000,
  })

  const [openModal, setOpenModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null)

  function handleEdit(user: User) {
    setSelectedUser(user)
    setOpenModal(true)
  }

  async function handleDeleteUser() {
    if (userIdToDelete === null) return

    try {
      const response = await api.delete(
        `fuelling/control-user/${userIdToDelete}`,
      )
      if (response.status === 200) {
        toast({ title: 'Usuário deletado com sucesso!', variant: 'success' })
        setUserIdToDelete(null)
        queryClient.invalidateQueries(['fuelling/control-user'])
      }
    } catch (error) {
      toast({ title: 'Erro ao deletar usuário!', variant: 'destructive' })
    }
  }

  return (
    <div className="grid max-h-full grid-cols-auto gap-4 overflow-auto">
      {usersData.map((user) => (
        <Card key={user.id} className="flex flex-col justify-between p-4">
          <div className="flex gap-2 self-end">
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={() => handleEdit(user)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon-sm"
              onClick={() => setUserIdToDelete(user.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="max-w-full flex-1 truncate">
                {user.user.label} - {user.type.label}
              </span>
            </TooltipTrigger>
            <TooltipContent>{user.user.label}</TooltipContent>
          </Tooltip>

          {user.train && (
            <div className="text-gray-500">Comboio: {user.train.label}</div>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-gray-500">
                Família: {user.branch.label}
              </span>
            </TooltipTrigger>
          </Tooltip>

          <div className="text-gray-500">
            Senha: {user.password.toString().replace(/./g, '*')}
          </div>
        </Card>
      ))}

      {selectedUser && (
        <ProductModal
          mode="edit"
          open={openModal}
          onOpenChange={setOpenModal}
          defaultValues={selectedUser}
          userId={selectedUser.id}
        />
      )}

      <AlertModal
        open={!!userIdToDelete}
        onOpenChange={(open) => {
          if (!open) setUserIdToDelete(null)
        }}
        onConfirm={handleDeleteUser}
      />
    </div>
  )
}

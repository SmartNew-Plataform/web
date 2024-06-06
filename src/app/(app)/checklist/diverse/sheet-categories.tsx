import { SelectData } from '@/@types/select-data'
import { AlertModal } from '@/components/alert-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Bolt, Pencil, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { CategoryFormData, ModalCategoryForm } from './modal-category-form'

export function SheetCategories() {
  const [createModalOpen, setCreatModalOpen] = useState(false)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | undefined>()
  const [editCategoryId, setEditCategoryId] = useState<string | undefined>()
  const [editModalData, setEditModalData] = useState<
    CategoryFormData | undefined
  >()

  const { toast } = useToast()

  async function fetchCategory() {
    const response = await api
      .get('smart-list/location/category')
      .then((response) => response.data)
    return response.data
  }

  const { data, refetch } = useQuery<SelectData[]>({
    queryKey: ['checklist/diverse/category'],
    queryFn: fetchCategory,
  })

  async function handleCreateCategory(data: CategoryFormData) {
    const response = await api.post('smart-list/location/category', {
      category: data.description,
    })

    if (response.status !== 201) return
    refetch()
    toast({
      title: `Categoria ${data.description} criada com sucesso`,
      variant: 'success',
    })
  }

  async function handleEditCategory(data: CategoryFormData) {
    const response = await api.put(
      `smart-list/location/category/${editCategoryId}`,
      {
        category: data.description,
      },
    )

    if (response.status !== 200) return
    refetch()
    toast({
      title: `Categoria ${data.description} editada com sucesso`,
      variant: 'success',
    })
  }

  async function handleDeleteCategory() {
    const response = await api.delete(
      `smart-list/location/category/${editCategoryId}`,
    )

    if (response.status !== 200) return
    refetch()
    toast({
      title: `Categoria deletada com sucesso`,
      variant: 'success',
    })
  }

  console.log(data)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Bolt size={16} />
          Categorias
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col gap-4">
        <div className="mt-4 flex items-end justify-between border-b border-zinc-200 pb-4">
          <SheetTitle>Categorias de diversos</SheetTitle>
          <Button onClick={() => setCreatModalOpen(true)}>
            <Plus size={16} />
            Novo
          </Button>
        </div>
        <div className="flex h-full flex-col gap-4 overflow-auto">
          {data?.map(({ label, value }) => {
            return (
              <Card key={value}>
                <CardContent className="relative pt-5">
                  <p>{label}</p>
                  <div className="absolute right-4 top-4 flex gap-2">
                    <Button
                      onClick={() => setDeleteCategoryId(value)}
                      variant="destructive"
                      size="icon-sm"
                    >
                      <Trash size={14} />
                    </Button>
                    <Button
                      onClick={() => {
                        setEditModalData({ description: label })
                        setEditCategoryId(value)
                      }}
                      variant="secondary"
                      size="icon-sm"
                    >
                      <Pencil size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <ModalCategoryForm
          onSubmit={handleCreateCategory}
          open={createModalOpen}
          onOpenChange={setCreatModalOpen}
        />
        <ModalCategoryForm
          onSubmit={handleEditCategory}
          open={!!editModalData}
          onOpenChange={(open) =>
            setEditModalData(open ? editModalData : undefined)
          }
          mode="edit"
          defaultValues={editModalData}
        />
        <AlertModal
          onConfirm={handleDeleteCategory}
          open={!!deleteCategoryId}
          onOpenChange={(open) =>
            setDeleteCategoryId(open ? deleteCategoryId : undefined)
          }
        />
      </SheetContent>
    </Sheet>
  )
}

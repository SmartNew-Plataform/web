'use client'

import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { DeleteCategoryItemModal } from './delete-category-item-modal'
import { UpdateCategoryItemModal } from './update-category-item-modal'

interface ListCategoryProps {
  categoryId: string
}

type CategoryItem = {
  id: number
  name: string
}

export function ListCategoryItem({ categoryId }: ListCategoryProps) {
  async function fetchCategoryItems() {
    const response = await api
      .get(`smart-list/diverse/${categoryId}/items`)
      .then((res) => res.data)

    return response
  }
  const { data, isLoading } = useQuery<CategoryItem[]>(
    ['checklist-category-item'],
    fetchCategoryItems,
  )

  return (
    <main className="grid grid-cols-auto gap-4">
      {isLoading ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        data?.map(({ id, name }) => {
          return (
            <Card key={id}>
              <CardHeader className="flex flex-row items-end justify-between">
                <span>{name}</span>

                <div className="flex gap-2">
                  <UpdateCategoryItemModal
                    data={{ name }}
                    itemId={id}
                    categoryId={categoryId}
                  />
                  <DeleteCategoryItemModal
                    categoryId={categoryId}
                    itemId={id}
                  />
                </div>
              </CardHeader>
            </Card>
          )
        })
      )}
    </main>
  )
}

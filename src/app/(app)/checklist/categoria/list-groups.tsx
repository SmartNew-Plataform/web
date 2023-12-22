'use client'

import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { UpdateGroupModal } from './update-group-modal'

type Group = {
  id: number
  name: string
}

export function ListGroups() {
  async function fetchDiverse() {
    const response = await api
      .get('/smart-list/diverse')
      .then((res) => res.data)

    return response
  }
  const { data, isLoading } = useQuery<Group[]>(['diverse:list'], fetchDiverse)

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
        data?.map(({ id, name }) => (
          <Card key={id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <span className="text-slate-600">{name}</span>
              <div className="flex gap-3">
                <UpdateGroupModal />
              </div>
            </CardHeader>
          </Card>
        ))
      )}
    </main>
  )
}

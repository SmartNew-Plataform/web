'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { DeleteGroupModal } from './delete-group-modal'
import { UpdateGroupModal } from './update-group-modal'

type Group = {
  id: number
  name: string
  branch: number
}

export function ListGroups() {
  const searchParams = useSearchParams()

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
        data?.map(({ id, name, branch }) => (
          <Card key={id}>
            <CardHeader className="flex flex-row items-end justify-between">
              <span>{name}</span>
              <div className="flex gap-2">
                <UpdateGroupModal data={{ id, name, branch }} />
                <DeleteGroupModal categoryId={id} />
                <Link
                  href={{
                    pathname: `/checklist/categoria/${id}`,
                    query: { token: searchParams.get('token') },
                  }}
                >
                  <Button size="icon-xs" variant="outline">
                    <ChevronRight className="h-3 w-3 text-zinc-600" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        ))
      )}
    </main>
  )
}

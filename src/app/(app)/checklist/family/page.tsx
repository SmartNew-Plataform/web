'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCoreScreensStore } from '@/store/core-screens-store'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { columns } from './columns'
import { DataTable } from './data-table'

export default function FamilyPage() {
  const [filter, setFilter] = useState('')
  const { loadFamily, familyScreen } = useCoreScreensStore(
    ({ loadFamily, familyScreen }) => {
      return {
        loadFamily,
        familyScreen,
      }
    },
  )

  useEffect(() => {
    loadFamily()
  }, [])

  return (
    <div className="flex max-h-full flex-col gap-4 p-4">
      <Card className="flex justify-between p-4">
        <Input
          type="text"
          className="max-w-sm"
          onChange={(e) => setFilter(e.target.value)}
        />

        <Button>
          <Plus className="h-4 w-4" />
          Novo
        </Button>
      </Card>
      <DataTable
        columns={columns}
        data={familyScreen?.table || []}
        globalFilter={filter}
      />
    </div>
  )
}

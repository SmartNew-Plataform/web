'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCoreScreensStore } from '@/store/core-screens-store'

export function HeaderInfo() {
  const { changeFilterText } = useCoreScreensStore(({ changeFilterText }) => ({
    changeFilterText,
  }))

  return (
    <Card className="rounded-md p-4">
      <Input
        className="max-w-sm"
        placeholder="Busca rapida"
        onChange={(e) => changeFilterText(e.target.value)}
      />
    </Card>
  )
}

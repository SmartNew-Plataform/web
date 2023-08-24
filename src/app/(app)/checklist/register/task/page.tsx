import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'

export default function TaskPage() {
  return (
    <div className="flex h-full w-full flex-col p-4">
      <Card className="flex justify-between p-4">
        <Input className="max-w-xs" />

        <Button>
          <Plus className="h-4 w-6" />
          Criar nova task
        </Button>
      </Card>
    </div>
  )
}

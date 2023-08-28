import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle, FileUp } from 'lucide-react'

export default function Asks({ params }: { params: { askId: string } }) {
  return (
    <div className="flex max-h-full flex-col gap-4 p-4">
      <Card className="flex items-center justify-between rounded-md p-4">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-ok">Não conforme</SelectItem>
            <SelectItem value="all" defaultChecked>
              Todos
            </SelectItem>
          </SelectContent>
        </Select>

        <Button>
          <FileUp className="h-4 w-4" />
          PDF
        </Button>
      </Card>

      <main className="flex h-full w-full flex-wrap gap-4">
        <Card className="space-y-2 rounded-md p-4">
          <h4 className="text-xl font-semibold text-slate-700">
            Como vai a vida ?
          </h4>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-4 w-4" />
            <span className="text-slate-600">Ta indo...</span>
          </div>
        </Card>
        <Card className="space-y-2 rounded-md p-4">
          <h4 className="text-xl font-semibold text-slate-700">
            Como vai a vida ?
          </h4>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-4 w-4" />
            <span className="text-slate-600">Ta indo...</span>
          </div>
        </Card>
        <Card className="space-y-2 rounded-md p-4">
          <h4 className="text-xl font-semibold text-slate-700">
            Como vai a vida ?
          </h4>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-4 w-4" />
            <span className="text-slate-600">Ta indo...</span>
          </div>
        </Card>
      </main>
    </div>
  )
}

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info, MoreVertical, Plus } from "lucide-react";

export function HeaderEmissionPage() {
  return (
    <PageHeader>
      <div className="flex gap-4 items-center">
        <Button variant="outline" size="icon">
          <ChevronLeft size={16} />
        </Button>
        <h2 className="text-xl font-bold text-zinc-700">Lançamento</h2>
      </div>

      <div className="flex gap-4 items-center">
        <Button>
          <Plus size={16} />
          Adicionar
        </Button>
        <Button variant="outline" size="icon">
          <Info size={16} />
        </Button>
        <Button variant="outline" size="icon">
          <MoreVertical size={16} />
        </Button>
      </div>
    </PageHeader>
  )
}
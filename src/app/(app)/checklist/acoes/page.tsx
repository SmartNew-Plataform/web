import { PageWrapper } from '@/components/page-wrapper'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GridActions } from './grid-actions'
import { GridGroups } from './grid-groups'

export default function AcoesPage() {
  return (
    <PageWrapper>
      <Tabs className="flex h-full flex-col overflow-auto">
        <TabsList className="self-start bg-slate-300">
          <TabsTrigger value="groups">Grupos</TabsTrigger>
          <TabsTrigger value="dropped-items">Itens soltos</TabsTrigger>
        </TabsList>
        <TabsContent className="h-full overflow-auto" value="groups">
          <GridGroups />
        </TabsContent>
        <TabsContent className="h-full overflow-auto" value="dropped-items">
          <GridActions />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  )
}

import { PageWrapper } from '@/components/page-wrapper'
import { GridGroups } from './grid-groups'

export default function AcoesPage() {
  return (
    <PageWrapper>
      <GridGroups />
      {/* <Tabs className="flex h-full flex-col overflow-auto">
        <TabsList defaultValue="groups" className="self-start bg-slate-300">
          <TabsTrigger defaultChecked value="groups">
            Grupos
          </TabsTrigger>
          <TabsTrigger value="dropped-items">Itens soltos</TabsTrigger>
        </TabsList>
        <TabsContent className="h-full overflow-auto" value="groups">
        </TabsContent>
        <TabsContent className="h-full overflow-auto" value="dropped-items">
          <GridActions />
        </TabsContent>
      </Tabs> */}
    </PageWrapper>
  )
}

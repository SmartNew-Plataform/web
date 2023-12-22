import { AsksList } from '@/components/asks-list'
import { Header } from '@/components/header-asks'
import { PageWrapper } from '@/components/page-wrapper'

export default function Asks({ params }: { params: { askId: string } }) {
  return (
    <PageWrapper>
      <Header />

      <main className="grid max-h-full w-full grid-cols-auto gap-4">
        <AsksList productionId={params.askId} />
      </main>
    </PageWrapper>
  )
}

import { AsksList } from '@/components/asks-list'
import { Header } from '@/components/header-asks'

export default function Asks({ params }: { params: { askId: string } }) {
  return (
    <div className="flex max-h-full flex-col gap-4 p-4 pt-0">
      <Header />

      <main className="grid h-full w-full grid-cols-auto gap-4">
        <AsksList productionId={params.askId} />
      </main>
    </div>
  )
}

import { AsksList } from './asks-list'
import { Header } from './header'

export default function Asks({ params }: { params: { askId: string } }) {
  return (
    <div className="flex max-h-full flex-col gap-4 p-4">
      <Header />

      <main className="grid h-full w-full grid-cols-auto gap-4">
        <AsksList productionId={params.askId} />
      </main>
    </div>
  )
}

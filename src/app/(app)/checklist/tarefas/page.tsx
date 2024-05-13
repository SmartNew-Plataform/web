import { PageWrapper } from '@/components/page-wrapper'
import { Header } from './header'
import { ListTask } from './list-task'

export default function TaskPage() {
  return (
    <PageWrapper>
      <Header />

      <ListTask />
    </PageWrapper>
  )
}

import { PageWrapper } from '@/components/page-wrapper'
import { Header } from './header'
import { Table } from './table'

export function ActivePage() {
  return (
    <PageWrapper>
      <Header />

      <Table />
    </PageWrapper>
  )
}

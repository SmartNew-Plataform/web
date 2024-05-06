import { PageWrapper } from '@/components/page-wrapper'
import { Header } from './header'
import { TableExcel } from './table'

export default function ImportationPage() {
  return (
    <PageWrapper>
      <Header />
      <TableExcel model={'data'} item={undefined} />
    </PageWrapper>
  )
}

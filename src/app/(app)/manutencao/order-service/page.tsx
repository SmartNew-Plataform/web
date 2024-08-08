import { PageWrapper } from '@/components/page-wrapper'
import { Header } from './header'
import { TableServiceOrder } from './table-service-order'

export default function ImportationPage() {
  return (
    <PageWrapper>
      <Header />
      <TableServiceOrder />
    </PageWrapper>
  )
}

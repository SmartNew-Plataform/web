import { PageWrapper } from '@/components/page-wrapper'
import { Header } from './header'
import { ListTank } from './list-tank'

export default function Page() {
  return (
    <PageWrapper>
      <Header />
      <ListTank />
    </PageWrapper>
  )
}

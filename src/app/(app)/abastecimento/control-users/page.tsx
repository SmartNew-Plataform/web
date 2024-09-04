import { PageWrapper } from '@/components/page-wrapper'
import { Metadata } from 'next'
import { Header } from './header'
import { UserList } from './users'

export const metadata: Metadata = {
  title: 'Vínculo De Usuários',
  description: 'Plataforma da SmartNew Sistemas.',
}

export default function Page() {
  return (
    <PageWrapper>
      <Header />
      <UserList />
    </PageWrapper>
  )
}

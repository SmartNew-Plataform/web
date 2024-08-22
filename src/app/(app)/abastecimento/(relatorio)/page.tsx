import { PageWrapper } from '@/components/page-wrapper'
import { Metadata } from 'next'
import { Header } from './header'
import { ListTank } from './list-tank'

export const metadata: Metadata = {
  title: 'Relatorio Combustivel',
  description: 'Plataforma da SmartNew Sistemas.',
}

export default function Page() {
  return (
    <PageWrapper>
      <Header />
      <ListTank />
    </PageWrapper>
  )
}

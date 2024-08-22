import { PageWrapper } from '@/components/page-wrapper'
import { Metadata } from 'next'
import { Header } from './header'
import { Table } from './table'

export const metadata: Metadata = {
  title: 'Relatorio Equipamento',
  description: 'Plataforma da SmartNew Sistemas.',
}

export default function Page() {
  return (
    <PageWrapper>
      <Header />
      <Table />
    </PageWrapper>
  )
}

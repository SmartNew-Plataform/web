import { PageWrapper } from '@/components/page-wrapper'
import { Metadata } from 'next'
import { Header } from './header'
import { FuelList } from './product'

export const metadata: Metadata = {
  title: 'Cadastro De Produtos',
  description: 'Plataforma da SmartNew Sistemas.',
}

export default function Page() {
  return (
    <PageWrapper>
      <Header />
      <FuelList />
    </PageWrapper>
  )
}

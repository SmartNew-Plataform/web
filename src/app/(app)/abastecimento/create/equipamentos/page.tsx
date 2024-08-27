import { Metadata } from 'next'
import { ActivePage as ActivePageComponent } from '../../../../../components/actives-page'

export const metadata: Metadata = {
  title: 'Cadastro de Equipamento',
  description: 'Plataforma da SmartNew Sistemas.',
}

export default function ActivePage() {
  return <ActivePageComponent />
}

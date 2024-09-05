import { ActivePage } from '@/components/actives-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cadastro de Equipamento',
  description: 'Plataforma da SmartNew Sistemas.',
}

export default function CadastroEquipamentos() {
  return <ActivePage />
}

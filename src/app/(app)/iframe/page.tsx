import { PageWrapper } from '@/components/page-wrapper'

export default function IframePage() {
  return (
    <PageWrapper>
      <iframe
        src="https://sistemas.smartnewsystem.com.br/blank_fornecedor_tela/?usr_login=bruno.matias&id_cliente=2&usr_modulo=11"
        className="h-full w-full"
        frameBorder="0"
      ></iframe>
    </PageWrapper>
  )
}

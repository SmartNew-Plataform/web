'use client'
import { useUserStore } from '@/store/user-store'

export function Iframe() {
  const { user } = useUserStore()

  return (
    <iframe
      src={`https://sistemas.smartnewsystem.com.br/blank_fornecedor_tela/?usr_login=${user?.login}&id_cliente=${user?.clientId}&usr_modulo=3`}
      className="h-full w-full"
      frameBorder="0"
    ></iframe>
  )
}

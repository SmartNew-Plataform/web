import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aqui você pode tratar os erros de acordo com suas necessidades
    if (error.response) {
      // Erro de resposta do servidor (por exemplo, status 4xx ou 5xx)
      console.error('Erro de resposta do servidor:', error.response.status)
      console.error('Mensagem de erro:', error.response.data)
    } else if (error.request) {
      // Erro de não ter recebido resposta do servidor
      console.error(
        'Erro de não ter recebido resposta do servidor:',
        error.request,
      )
    } else {
      // Erro ao configurar a solicitação
      console.error('Erro ao configurar a solicitação:', error.message)
    }

    // Retorne uma Promise rejeitada para que o código que chamou a requisição possa lidar com o erro
    return Promise.reject(error)
  },
)

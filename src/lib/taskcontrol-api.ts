import axios from 'axios'

export const taskcontrolApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL_TASKCONTROL}/v1`,
})

import axios from 'axios'

export const http = axios.create({
  baseURL: 'https://api.postmon.com.br/v1/usuario/',
  timeout: 3000
})

import axios from 'axios'

export const http = axios.create({
  baseURL: `${process.env.API}/fornecedores`,
  timeout: 10000
})

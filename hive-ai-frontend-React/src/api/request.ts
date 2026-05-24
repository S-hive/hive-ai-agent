import axios from 'axios'
import { API_BASE_URL } from './config'

const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000,
})
request.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
)

export default request

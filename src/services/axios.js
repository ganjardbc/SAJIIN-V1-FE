import axios from 'axios'
import VueCookies from 'vue-cookies'

const BASE_URL_V2 = process.env.API_URL_V2
const xApiKey = process.env.X_API_KEY
const token = VueCookies.get('token')

const apiv2 = axios.create({
  baseURL: BASE_URL_V2,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`,
    'x-api-key': xApiKey
  }
})

export default apiv2
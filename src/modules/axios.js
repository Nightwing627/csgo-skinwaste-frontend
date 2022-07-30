import axios from 'axios'

const instance = axios.create({
  baseURL: CONFIG.api.url,
  withCredentials: true,
  headers: {
    Authorization: {
      toString() {
        return `Bearer ${localStorage.getItem('token')}`
      }
    }
    // 'x-csrf-token': {
    //   toString() {
    //     return localStorage.getItem('csrf')
    //   }
    // }
  }
})

instance.interceptors.response.use(
  response => {
    if (response.data.success === false) {
      return Promise.reject(response.message)
    }

    return response.data.response
  },
  error => {
    if (!error.response) return Promise.reject(error)
    if (!error.response.data) return Promise.reject(error.response)
    return Promise.reject(error.response.data)
  }
)

export default instance

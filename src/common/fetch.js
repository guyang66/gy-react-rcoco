import axios from 'axios'
import helper from '@helper'

// todo: 怎么模拟mock？
const service = axios.create({
  baseURL: '', // api的base_url
  timeout: 50000,// 请求超时时间
  headers: {
    authorization: helper.getToken(),
  },
})

service.interceptors.response.use(
  response => {
    /**
     * response.data.success是false抛错
     */
    if (response.data.success === false) {
      // todo:token过期或者，无法登录
      return Promise.reject(response.data)
    }
    return response.data.data
  },
  error => {
    error.errorMsg = error.message

    console.log(error)
    return Promise.reject(error)
  }
)

export default service

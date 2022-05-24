import fetch from '@common/fetch'

const urlPrefix = '/admin/api/user/'

const Api = {
  getUserInfo(params) {
    return fetch({
      url: urlPrefix + 'getUserInfo/auth',
      method: 'get',
      params,
    })
  },

  updateUserInfo (params) {
    return fetch({
      url: urlPrefix + 'updateUserInfo/auth',
      method: 'post',
      data: params,
    })
  },

  updatePassword (params) {
    return fetch({
      url: urlPrefix + 'updatePassword/auth',
      method: 'post',
      data: params,
    })
  },
}

export default Api

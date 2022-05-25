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

  // 用户自己修改自己的信息，需要校验当前人是不是自己
  modifyUserInfo (params) {
    return fetch({
      url: urlPrefix + 'modify/auth',
      method: 'post',
      data: params,
    })
  },

  // 管理员修改用户信息，需要校验url 权限
  updateUserInfo (params) {
    return fetch({
      url: urlPrefix + 'update/auth',
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

  resetPassword (params) {
    return fetch({
      url: urlPrefix + 'resetPassword/auth',
      method: 'get',
      params,
    })
  },

  getUserList (params) {
    return fetch({
      url: urlPrefix + 'list/auth',
      method: 'post',
      data: params,
    })
  },

  deleteUser (params) {
    return fetch({
      url: urlPrefix + 'delete/auth',
      method: 'get',
      params,
    })
  },

  createUser (params) {
    return fetch({
      url: urlPrefix + 'create/auth',
      method: 'post',
      data: params,
    })
  },

}

export default Api

import fetch from '@common/fetch'

const urlPrefix = '/admin/api/activity/'

const Api = {
  getActivityList(params) {
    return fetch({
      url: urlPrefix + 'list/auth',
      method: 'post',
      data: params,
    })
  },

  updateActivity (params) {
    return fetch({
      url: urlPrefix + 'update/auth',
      method: 'post',
      data: params,
    })
  },

  deleteActivity (params) {
    return fetch({
      url: urlPrefix + 'delete/auth',
      method: 'get',
      params,
    })
  },

  saveActivity (params) {
    return fetch({
      url: urlPrefix + 'save/auth',
      method: 'post',
      data: params,
    })
  },

  setMain (params) {
    return fetch({
      url: urlPrefix + 'main/auth',
      method: 'get',
      params,
    })
  },
}

export default Api

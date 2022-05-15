import fetch from '@common/fetch'

const urlPrefix = '/admin/api/resume/'

export default {
  getResumeColumn(params) {
    return fetch({
      url: urlPrefix + 'column/auth',
      method: 'get',
      params,
    })
  },

  getResumeCategory(params) {
    return fetch({
      url: urlPrefix + 'category/auth',
      method: 'get',
      params,
    })
  },

  getResumePlace(params) {
    return fetch({
      url: urlPrefix + 'place/auth',
      method: 'get',
      params,
    })
  },

  getResumeList(params) {
    return fetch({
      url: urlPrefix + 'list/auth',
      method: 'post',
      data: params,
    })
  },

  getCategoryList(params) {
    return fetch({
      url: urlPrefix + 'category/list/auth',
      method: 'post',
      data: params,
    })
  },

  updateResume(params) {
    return fetch({
      url: urlPrefix + 'update/auth',
      method: 'post',
      data: params,
    })
  },

  updateResumeCategory (params) {
    return fetch({
      url: urlPrefix + 'category/update/auth',
      method: 'post',
      data: params,
    })
  },

  updateResumePlace (params) {
    return fetch({
      url: urlPrefix + 'place/update/auth',
      method: 'post',
      data: params,
    })
  },

  deleteResumeCategory (params) {
    return fetch({
      url: urlPrefix + 'category/delete/auth',
      method: 'get',
      params,
    })
  },

  deleteResumePlace (params) {
    return fetch({
      url: urlPrefix + 'place/delete/auth',
      method: 'get',
      params,
    })
  },

  saveResumeCategory (params) {
    return fetch({
      url: urlPrefix + 'category/save/auth',
      method: 'post',
      data: params,
    })
  },

  saveResumePlace (params) {
    return fetch({
      url: urlPrefix + 'place/save/auth',
      method: 'post',
      data: params,
    })
  },

  deleteResume(params) {
    return fetch({
      url: urlPrefix + 'delete/auth',
      method: 'get',
      params,
    })
  },

  getPlaceList (params) {
    return fetch({
      url: urlPrefix + 'place/list/auth',
      method: 'post',
      data: params,
    })
  },

  getResumeDetail (params) {
    return fetch({
      url: urlPrefix + 'detail/auth',
      method: 'get',
      params,
    })
  },

  saveResume (params) {
    return fetch({
      url: urlPrefix + 'save/auth',
      method: 'post',
      data: params,
    })
  },
}

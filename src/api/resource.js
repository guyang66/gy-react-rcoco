import fetch from '@common/fetch'

const urlPrefix = '/admin/api/resource/'

export default {
  getResourceList(param) {
    return fetch({
      url: urlPrefix + 'list/auth',
      method: 'post',
      data: param,
    })
  },

  getResourceDetail (params) {
    return fetch({
      url: urlPrefix + 'detail/auth',
      method: 'get',
      params,
    })
  },

  updateResource (params) {
    return fetch({
      url: urlPrefix + 'update/auth',
      method: 'post',
      data: params,
    })
  },

  saveResource (params) {
    return fetch({
      url: urlPrefix + 'save/auth',
      method: 'post',
      data: params,
    })
  },

  deleteResource (params) {
    return fetch({
      url: urlPrefix + 'delete/auth',
      method: 'get',
      params,
    })
  },

  getColumnList(param) {
    return fetch({
      url: urlPrefix + 'column/list/auth',
      method: 'get',
      data: param,
    })
  },

  updateColumn (params) {
    return fetch({
      url: urlPrefix + 'column/update/auth',
      method: 'post',
      data: params,
    })
  },

  getCategoryOnlineList(param) {
    return fetch({
      url: urlPrefix + 'category/online/auth',
      method: 'get',
      data: param,
    })
  },

  getResourceCategory(param) {
    return fetch({
      url: urlPrefix + 'category/list/auth',
      method: 'get',
      data: param,
    })
  },

  updateCategory (params) {
    return fetch({
      url: urlPrefix + 'category/update/auth',
      method: 'post',
      data: params,
    })
  },

  deleteCategory (params) {
    return fetch({
      url: urlPrefix + 'category/delete/auth',
      method: 'get',
      params,
    })
  },

  saveCategory (params) {
    return fetch({
      url: urlPrefix + 'category/save/auth',
      method: 'post',
      data: params,
    })
  },

  getResourceRecordList (params) {
    return fetch({
      url: urlPrefix + 'record/list/auth',
      method: 'post',
      data: params,
    })
  },

  staticsType (params) {
    return fetch({
      url: urlPrefix + 'statics/type/auth',
      method: 'get',
      params,
    })
  },

  staticsResourceName (params) {
    return fetch({
      url: urlPrefix + 'statics/resourceName/auth',
      method: 'get',
      params,
    })
  },

  staticsKeywords (params) {
    return fetch({
      url: urlPrefix + 'statics/keywords/auth',
      method: 'get',
      params,
    })
  },
}

import fetch from '@common/fetch'

const urlPrefix = '/admin/api/'

export default {

  getIndexBanners(params) {
    return fetch({
      url: urlPrefix + 'index/banner/auth',
      method: 'get',
      params,
    })
  },

  updateIndexBanners(param) {
    return fetch({
      url: urlPrefix + 'index/banner/update/auth',
      method: 'post',
      data: param,
    })
  },

  getBannerActions(params) {
    return fetch({
      url: urlPrefix + 'index/banner/action/auth',
      method: 'get',
      params,
      // overHandle: true,
    })
  },

  getIndexColumn(params) {
    return fetch({
      url: urlPrefix + 'index/Column/auth',
      method: 'get',
      params,
    })
  },

  updateIndexColumn(param) {
    return fetch({
      url: urlPrefix + 'index/column/update/auth',
      method: 'post',
      data: param,
    })
  },

  getPageTdkList (param) {
    return fetch({
      url: urlPrefix + 'tdk/list/auth',
      method: 'post',
      data: param,
    })
  },

  updateTdk (params) {
    return fetch({
      url: urlPrefix + 'tdk/update/auth',
      method: 'post',
      data: params,
    })
  },

  deleteTdk (params) {
    return fetch({
      url: urlPrefix + 'tdk/delete/auth',
      method: 'get',
      params,
    })
  },

  saveTdk (params) {
    return fetch({
      url: urlPrefix + 'tdk/save/auth',
      method: 'post',
      data: params,
    })
  },
}

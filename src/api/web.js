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

  getIndexNews(params) {
    return fetch({
      url: urlPrefix + 'index/news/auth',
      method: 'get',
      params,
    })
  },

  updateIndexNews(param) {
    return fetch({
      url: urlPrefix + 'index/news/update/auth',
      method: 'post',
      data: param,
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
}

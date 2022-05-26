import fetch from '@common/fetch'

const urlPrefix = '/admin/api/news/'

export default {
  getOnlineNews(params) {
    return fetch({
      url: urlPrefix + 'list/online/auth',
      method: 'get',
      params,
    })
  },

  getIndexNews(params) {
    return fetch({
      url: '/admin/api/index/news/auth',
      method: 'get',
      params,
    })
  },

  updateIndexNews(param) {
    return fetch({
      url: '/admin/api/index/news/update/auth',
      method: 'post',
      data: param,
    })
  },

  getNewsList(param) {
    return fetch({
      url: urlPrefix + 'list/auth',
      method: 'post',
      data: param,
    })
  },

  updateNews (params) {
    return fetch({
      url: urlPrefix + 'update/auth',
      method: 'post',
      data: params,
    })
  },

  deleteNews (params) {
    return fetch({
      url: urlPrefix + 'delete/auth',
      method: 'get',
      params,
    })
  },

  saveNews (params) {
    return fetch({
      url: urlPrefix + 'save/auth',
      method: 'post',
      data: params,
    })
  },

  getNewsCategoryOnline (params) {
    return fetch({
      url: urlPrefix + 'category/online/auth',
      method: 'get',
      params,
    })
  },

  getNewsCategory (params) {
    return fetch({
      url: urlPrefix + 'category/list/auth',
      method: 'get',
      params,
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

  getNewsDetail (params) {
    return fetch({
      url: urlPrefix + 'detail/auth',
      method: 'get',
      params,
    })
  },

  staticsViewCount(params) {
    return fetch({
      url: urlPrefix + 'statics/viewCount/auth',
      method: 'get',
      params,
    })
  },

  staticsKeywords(params) {
    return fetch({
      url: urlPrefix + 'statics/keywords/auth',
      method: 'get',
      params,
    })
  },
}

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

}

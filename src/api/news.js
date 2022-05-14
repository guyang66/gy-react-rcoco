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
}

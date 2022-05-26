import fetch from '@common/fetch'

const urlPrefix = '/admin/api/clue/'

export default {
  getClueList(param) {
    return fetch({
      url: urlPrefix + 'list/auth',
      method: 'post',
      data: param,
    })
  },

  staticsType (params) {
    return fetch({
      url: urlPrefix + 'statics/type/auth',
      method: 'get',
      params,
    })
  },

  staticsNeed (params) {
    return fetch({
      url: urlPrefix + 'statics/need/auth',
      method: 'get',
      params,
    })
  },

  staticsOriginHref (params) {
    return fetch({
      url: urlPrefix + 'statics/originHref/auth',
      method: 'get',
      params,
    })
  },
}

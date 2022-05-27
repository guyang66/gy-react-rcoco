import fetch from '@common/fetch'

const urlPrefix = '/admin/api/case/'

const Api = {
  getCaseList(params) {
    return fetch({
      url: urlPrefix + 'list/auth',
      method: 'post',
      data: params,
    })
  },

  updateCase (params) {
    return fetch({
      url: urlPrefix + 'update/auth',
      method: 'post',
      data: params,
    })
  },

  deleteCase (params) {
    return fetch({
      url: urlPrefix + 'delete/auth',
      method: 'get',
      params,
    })
  },

  saveCase (params) {
    return fetch({
      url: urlPrefix + 'save/auth',
      method: 'post',
      data: params,
    })
  },

  getCaseTag (params) {
    return fetch({
      url: urlPrefix + 'tag/list/auth',
      method: 'get',
      params,
    })
  },

  updateCaseTag (params) {
    return fetch({
      url: urlPrefix + 'tag/update/auth',
      method: 'post',
      data: params,
    })
  },

  deleteCaseTag (params) {
    return fetch({
      url: urlPrefix + 'tag/delete/auth',
      method: 'get',
      params,
    })
  },

  saveCaseTag (params) {
    return fetch({
      url: urlPrefix + 'tag/save/auth',
      method: 'post',
      data: params,
    })
  },

  staticsVisit (params) {
    return fetch({
      url: urlPrefix + 'statics/visit/auth',
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

  getStaticRecordList (params) {
    return fetch({
      url: urlPrefix + 'record/list/auth',
      method: 'post',
      data: params,
    })
  },
}

export default Api

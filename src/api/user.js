import fetch from '@common/fetch'

const urlPrefix = '/admin/api/'

export default  {

  getUserInfo(params) {
    return fetch({
      url: urlPrefix + 'user/getUserInfo/auth',
      method: 'get',
      params,
    })
  },
}

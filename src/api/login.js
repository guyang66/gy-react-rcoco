import fetch from '@common/fetch'

const urlPrefix = '/admin/api/'

export default {
  login(param) {
    return fetch({
      url: urlPrefix + 'login',
      method: 'post',
      data: param,
    })
  },
}

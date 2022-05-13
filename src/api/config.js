import fetch from '@common/fetch'

const urlPrefix = '/admin/api/'

export default {

  getUserMenu(params) {
    return fetch({
      url: urlPrefix + 'menu/auth',
      method: 'get',
      params,
    })
  },

  getRoute(params) {
    return fetch({
      url: urlPrefix + 'route/auth',
      method: 'get',
      params,
    })
  },

  getMenuList(param) {
    return fetch({
      url: urlPrefix + 'menu/list/auth',
      method: 'post',
      data: param,
    })
  },

  updateAdminMenu(param) {
    return fetch({
      url: urlPrefix + 'menu/update/auth',
      method: 'post',
      data: param,
    })
  },

  getRouteList(param) {
    return fetch({
      url: urlPrefix + 'route/list/auth',
      method: 'post',
      data: param,
    })
  },

  getComponentPermission(params) {
    return fetch({
      url: urlPrefix + 'permission/component/auth',
      method: 'get',
      params,
    })
  },

  getCaptcha(params) {
    return fetch({
      url: urlPrefix + 'getCaptcha',
      method: 'get',
      params,
    })
  },
}

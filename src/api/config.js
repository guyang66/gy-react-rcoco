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

  updateAdminRoute(param) {
    return fetch({
      url: urlPrefix + 'route/update/auth',
      method: 'post',
      data: param,
    })
  },

  getUiPermission(params) {
    return fetch({
      url: urlPrefix + 'permission/ui/online/auth',
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

  getCommonTag(params) {
    return fetch({
      url: urlPrefix + 'tag/online/auth',
      method: 'get',
      params,
    })
  },

  getRoles (params) {
    return fetch({
      url: urlPrefix + 'role/online/auth',
      method: 'get',
      params,
    })
  },

  getRoleList (param) {
    return fetch({
      url: urlPrefix + 'role/list/auth',
      method: 'post',
      data: param,
    })
  },

  deleteRole (params) {
    return fetch({
      url: urlPrefix + 'role/delete/auth',
      method: 'get',
      params,
    })
  },

  saveRole (param) {
    return fetch({
      url: urlPrefix + 'role/save/auth',
      method: 'post',
      data: param,
    })
  },

  getCacheList (param) {
    return fetch({
      url: urlPrefix + 'cache/list/auth',
      method: 'post',
      data: param,
    })
  },

  updateCache (param) {
    return fetch({
      url: urlPrefix + 'cache/update/auth',
      method: 'post',
      data: param,
    })
  },

  deleteCache (params) {
    return fetch({
      url: urlPrefix + 'cache/delete/auth',
      method: 'get',
      params,
    })
  },

  saveCache (param) {
    return fetch({
      url: urlPrefix + 'cache/save/auth',
      method: 'post',
      data: param,
    })
  },

  refreshCache (params) {
    return fetch({
      url: urlPrefix + 'cache/refresh/auth',
      method: 'get',
      params,
    })
  },

  refreshAllCache (params) {
    return fetch({
      url: urlPrefix + 'cache/refreshAll/auth',
      method: 'get',
      params,
    })
  },

  getUiPermissionList (param) {
    return fetch({
      url: urlPrefix + 'permission/ui/list/auth',
      method: 'post',
      data: param,
    })
  },

  getUrlPermissionList (param) {
    return fetch({
      url: urlPrefix + 'permission/url/list/auth',
      method: 'post',
      data: param,
    })
  },

  getStaticPvList (params) {
    return fetch({
      url: urlPrefix + 'statics/pv/list/auth',
      method: 'post',
      data: params,
    })
  },

  staticsPvVisit (params) {
    return fetch({
      url: urlPrefix + 'statics/pv/visit/auth',
      method: 'get',
      params,
    })
  },

  staticsPvLine (params) {
    return fetch({
      url: urlPrefix + 'statics/pv/line/auth',
      method: 'get',
      params,
    })
  },

  staticsUvLine (params) {
    return fetch({
      url: urlPrefix + 'statics/uv/line/auth',
      method: 'get',
      params,
    })
  },

}

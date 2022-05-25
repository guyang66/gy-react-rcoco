import {observable, action} from 'mobx'
import helper from '@helper'
import apiUser from '@api/user'
import apiConfig from '@api/config'

import privateRoutes from "@router/private-routes";
import menuConfig from "@config/menu-config";

class AppStore {
  // 页面级loading
  @observable loading = true

  @observable token = helper.getToken()
  @observable user = {}
  @observable currentRole = null
  @observable routeMap = []
  @observable menus = menuConfig

  @observable cPermission = []

  @action setLoading = (loading) => {
    this.loading = loading
  }

  @action setUser = (user) => {
    this.user = user
  }

  @action setCurrentRole = (role) => {
    this.currentRole = role
  }

  @action setMenus = (menu) => {
    this.menus = menu
  }

  @action setRouteMap = (map)=>{
    this.routeMap = map
  }

  @action initToken = () => {
    this.token = helper.getToken()
  }

  @action setToken = (token) => {
    helper.setToken(token)
    this.initToken()
  }

  @action setCPermission = (p) => {
    this.cPermission = p
  }

  @action logout = () => {
    helper.removeToken()
    this.user = null
    this.token = null
  }

  @action getUserInfo = async () => {
    const r = await apiUser.getUserInfo()
    this.loading = false
    this.user = r
  }

  @action getRouteMap = async () => {
    const r = await apiConfig.getRoute()
    this.routeMap = r
  }

  @action getPageConfig = async () => {
    if(this.menus.length > 0 && this.routeMap.length > 0){
      return
    }
    const p1 = apiConfig.getRoute()
    const p2 = apiUser.getUserInfo()
    const p3 = apiConfig.getUserMenu()
    const p4 = apiConfig.getUiPermission()
    const initRouteMap = (current) => {
      if(!current || current.length < 1){
        return []
      }
      const finalRoute = []
      current.forEach( route=> {
        const target = privateRoutes.find(value=>{
          return value.key === route.key
        })
        if(target){
          finalRoute.push({...target,...route})
        }
      })
      return finalRoute
    }

    Promise.all([p1,p2, p3, p4]).then((r)=>{
      // 拥有的权限路由
      this.routeMap = initRouteMap(r[0]) || []
      // 用户配置初始化
      this.user = r[1] || {}
      this.currentRole = r[1].defaultRole || ''
      // 菜单（前端计算）
      // this.menus = helper.computeMenus(this.currentRole, menuList)
      // 菜单（服务端生成）
      this.menus = r[2] || []
      // ui权限
      this.cPermission = r[3] || []
      this.loading = false
    }).catch(()=>{
      this.loading = false
    })
  }
}

export default new AppStore()

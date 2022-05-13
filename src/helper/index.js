import Cookies from 'js-cookie'

const TokenKey = 'accessToken'

/**
 * token
 * @returns {*}
 */
const getToken = () => {
  return Cookies.get(TokenKey)
}

const setToken = (token) => {
  // cookie 30天 失效
  return Cookies.set(TokenKey, token, {expires: 30})
}

const removeToken = () => {
  return Cookies.remove(TokenKey)
}

/**
 * 计算当前高亮的菜单项
 * @param role
 * @param data
 * @returns {[]|*[]}
 */
const computeMenus = (role, data) => {
  if(!role || role === ''){
    return []
  }
  if(!data || data.length < 1){
    return []
  }
  const collectChildren = (list, level, key) => {
    list = JSON.parse(JSON.stringify(list))
    const tmp = []
    for(let i = 0; i < list.length; i ++){
      const item = list[i]
      if(item.level !== level){
        continue
      }
      if(key && key !== item.parentMenu){
        continue
      }

      if(role === 'admin' || role === 'superAdmin'){
        tmp.push(item)
      } else if(item.roles.indexOf(role) > -1){
        tmp.push(item)
      }
    }

    tmp.forEach(item=>{
      // 如果有child，递归继续查找子菜单，知道所有菜单hasChild为false
      if(item.hasChild){
        item.children = collectChildren(list, level + 1, item.key)
      }
    })
    return tmp
  }

  return  collectChildren(data, 1)
}

/**
 * ui权限判断
 * @param key
 * @param appStore
 * @param reverse 为false为精确匹配。为true为弱匹配——表示permission列表中匹配不到该key，直接默认有权限。
 * @returns {boolean}
 */
const hasCPermission = (key, appStore, reverse) => {

  const {currentRole, cPermission} = appStore
  const targetPermission = cPermission.find(item=>{
    return item.key === key
  })

  if(!targetPermission && reverse){
    return true
  }

  const result = targetPermission.roles.find(item=>{
    return item === currentRole
  })
  return !!result
}

export default {
  getToken,
  removeToken,
  setToken,
  hasCPermission,
  computeMenus,
}

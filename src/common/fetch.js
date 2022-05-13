import axios from 'axios'
import helper from '@helper'
import {message, notification, Button} from 'antd'
import settingStore from "../store/setting-store";
// todo: 怎么模拟mock？

// todo: 问题2，出现了一个bug，用super登录之后，登出，然后再用admin登录，还是显示的super的账号信息，刷新一下就正常了（或者登出到登录页面刷新一下）。token串掉了，原因是
// service是一个用axios创建的实例对象，传入的headers参数其实是死的，用super登录之后service实例是super的token初始化好的，我登出的时候并没有刷新浏览器（包括再次登录）
// 所以即使我cookie中已经存放了admin的token，但是发请求的时候依旧还是用的super的token，刷新浏览器，store会被重新初始化一次，service也会重新生成，所以就变正常了，单页面的2b错误。。。
// 所以每个fetch需要重写headers中的authorization，但是每个请求都需要加这个参数，要是新的协作者不知道这个情况（祈祷他是copy代码），很容易漏写，倒时候权限错乱出现奇怪的bug。。
// 比如前一个人登录了超级管理员，登出之后，后一个人再游客登录就能获得超级管理员的权限
// 显然易见，这是一个公共参数，我希望的是有一个类似守卫一样的东西，直接帮我做掉
// 方法1、用proxy包裹 api对象 ，比如 scr/api/config.js , 导出一个对象，那么proxy就能设置setter和getter，拦截到每个api，然后重写掉headers中的authorization即可。

const service = axios.create({
  baseURL: '', // api的base_url
  timeout: 50000,// 请求超时时间
  headers: {
    authorization: helper.getToken(),
  },
})

// 服务端返回格式
// {
//   success: true,
//   data: content,
//   errorCode: '',
//   errorMessage: ''
// }

service.interceptors.request.use(config=>{
  config.headers.authorization = helper.getToken()
  return config
},error =>{
  return Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    /**
     * response.data.success是false抛错
     */
    if (response.data.success === false) {
      if(response.data.errorCode === 4005 || response.data.errorCode === '4005'){
        const {logoutDialog , setLogoutDialog} = settingStore
        if(logoutDialog){
          // 因为一个页面可能有多个接口调用，如果有多个就会导致显示多个notification
          // 所以加一个tag，如果显示过未登录notification后就遇到同样的错误就不要显示了
          return;
        }
        // 用户未登录，或者服务端重启过，jwt key 已经重置过，身份已经失效。
        const key = `open${Date.now()}`;
        const btn = (
          <Button type="primary" size="small" onClick={() => notification.close(key)}>
            确定
          </Button>
        );
        setLogoutDialog(true)
        message.error('登录信息已失效，请重新登录!')
        notification.open({
          message: '温馨提示：',
          description:
            '登录信息已失效，请重新登录!',
          btn,
          key,
          duration: null,
          onClick: ()=>{
            setLogoutDialog(false)
            window.location.reload()
          },
          onClose: ()=>{
            setLogoutDialog(false)
            window.location.reload()
          },
        })
        helper.removeToken()
        return Promise.reject(response.data.errorMessage)
      }
    }
    return response.data.data
  },
  error => {
    console.log(error)
    return Promise.reject(error.message)
  }
)

export default service

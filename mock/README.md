### json-server doc（文档）
https://www.npmjs.com/package/json-server#add-custom-routes

### json-server 特点
1、使用json轻松实现mock
2、不支持post请求，所以如果需要模拟post请求，则需要定制化,并且用中间件来处理（详细请查看文档）

### mock数据说明
本mock数据是方便没有启动服务端(kcoco)的同学使用，请注意：
1、mock目录下的mock数据是以某superAdmin（超级管理员）账号进行mock的静态数据，部分功能可能会受限。
2、在mock模式下，只保证页面渲染不出错，其他交互接口可能会报404，如需体验完整功能，请启动相关服务端。
3、在mock模式下，任意账号密码均可登录，且mock数据均不带有鉴权功能，包括且不限于：token校验、路由菜单权限、url权限、ui权限，如需体验完整功能，请启动相关服务端。
4、在mock模式下，有些数据可能不准确（比如统计数据不是日期实时的,比如带有复杂查询参数的），如需体验完整功能，请启动相关服务端。
5、在mock模式下，优先静态资源（比如图片资源）可能加载有误，因为有些图片资源可能上传到服务端了。如需体验完整功能，请启动相关服务端。
6、在mock模式下，所有post通过中间件处理，将请求都转化为get请求（这也意味着将整个丢弃掉post的body）

### 服务端项目地址

https://github.com/guyang66/gy-nodejs-kcoco

### mock进阶
##### 如何和服务端接口共存？
有如下场景：假如你在开发过程中有了新需求（比如开发一个新的页面），此时新页面的数据需要mock，而其他数据则还是通过服务端获取。经测试当你启动mock服务，并且也启动
了后台服务时（注意：如果先启动后台服务，再启动mock，会出现端口已被占用错误），此时mock服务会覆盖后台服务，导致大部分接口404。

所以你需要做的是：通过代理服务器转发到不同服务，比如nginx，本项目设置如下：
1、配置./config/config-default.js为proxy添加新的配置：
```
    {
      context: ['/admin/mock'],
      target: 'http://localhost:8092/api',
      changeOrigin: true,
      pathRewrite: {
        '^/admin/api': '',
      },
    },
```

2、修改./mock/json-server.json的port为8092（具体以proxy配置端口）
```
{
    "port": 8092,
    "routes": "./mock/routes.json",
    "host": "0.0.0.0"
}
```
3、将新页面所要用的api（比./src/api/config.js）配置urlPrefix为'/admin/mock'即可(这样api接口会被代理转发到后台服务，mock接口则会被代理转发到mock服务)
```
import fetch from '@common/fetch'

const urlPrefix = '/admin/mock/'

export default {
  newApiName(params) {
    return fetch({
      url: urlPrefix + 'newsPage/list',
      method: 'get',
      params,
    })
  },
  ...
}
```
4、重启服务即可生效。


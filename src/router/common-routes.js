import Welcome from "@pages/views/welcome";
import Person from "@pages/views/person"

// 公共路由不需要走服务端。
const publicRoutes = [
  {
    path: '/admin/index',
    name: '首页',
    key: 'index',
    exact: true,
    component: Welcome,
  },
  {
    path: '/admin/person',
    name: '个人信息',
    key: 'person',
    exact: true,
    component: Person,
  },
];

export default publicRoutes;

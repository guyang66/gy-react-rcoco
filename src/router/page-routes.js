import NotFount from "@pages/404";
import AccessDeny from "@pages/403"
import Login from '@pages/login'

const publicPageRoutes = [
  {
    path: '/admin/login',
    component: Login,
    exact: true,
    key: 'login',
  },
  {
    path: '/admin/403',
    component: AccessDeny,
    exact: true,
    key: 'error-403',
  },
  {
    path: '/admin/404',
    component: NotFount,
    exact: true,
    key: 'error-404',
  },
];

export default publicPageRoutes;

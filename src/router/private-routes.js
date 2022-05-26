import WebIndexNews from "@pages/views/web/index/news";
import WebIndexBanner from "@pages/views/web/index/banner";
import WebIndexColumn from "@pages/views/web/index/column";
import ResumeList from "@pages/views/web/resume/list";
import ResumeType from "@pages/views/web/resume/type";
import ResumeDetail from "@pages/views/web/resume/detail";
import ResumeTag from "@pages/views/web/resume/tag";
import CaseList from "@pages/views/web/case/list";
import CaseTag from "@pages/views/web/case/tag";
import ActivityProduct from "@pages/views/web/activity/product";
import ActivityHot from "@pages/views/web/activity/hot";
import ActivityBrand from "@pages/views/web/activity/brand";
import resourceList from "@pages/views/web/resource/list";
import resourceColumn from "@pages/views/web/resource/column";
import resourceCategory from "@pages/views/web/resource/category";
import resourceDetail from "@pages/views/web/resource/detail";
import newsList from "@pages/views/web/news/list";
import newsDetail from "@pages/views/web/news/detail";
import newsCategory from "@pages/views/web/news/category";
import TdkManage from "@pages/views/web/tdk";
import AppMenu from "@pages/views/app/menu";
import AppRoute from "@pages/views/app/route";
import AppCache from "@pages/views/app/cache";
import uiPermission from "@pages/views/app/permission/ui";
import urlPermission from "@pages/views/app/permission/url";
import roleManage from "@pages/views/app/role";
import userManage from "@pages/views/userManage";
import dataClue from "@pages/views/data/web/clue";
import dataResource from "@pages/views/data/web/resource";
import dataNews from "@pages/views/data/web/news";

const privateRoutes = [
  {
    path: '/admin/web/index/banner',
    name: 'banner配置',
    exact: true,
    key: 'web_index_banner',
    role: [],
    backUrl: '',
    component: WebIndexBanner,
  },
  {
    path: '/admin/web/index/news',
    name: '新闻配置',
    exact: true,
    key: 'web_index_news',
    role: [],
    backUrl: '',
    component: WebIndexNews,
  },
  {
    path: '/admin/web/index/column',
    name: '栏目设置',
    exact: true,
    key: 'web_index_column',
    role: [],
    backUrl: '',
    component: WebIndexColumn,
  },
  {
    path: '/admin/web/resume/list',
    name: '岗位管理',
    exact: true,
    key: 'web_resume_list',
    role: [],
    backUrl: '',
    component: ResumeList,
  },
  {
    path: '/admin/web/resume/type',
    name: '岗位管理',
    exact: true,
    key: 'web_resume_type',
    role: [],
    backUrl: '',
    component: ResumeType,
  },
  {
    path: '/admin/web/resume/detail',
    name: '岗位详情',
    exact: true,
    key: 'web_resume_detail',
    role: [],
    backUrl: '',
    component: ResumeDetail,
  },
  {
    path: '/admin/web/resume/tag',
    name: '标签管理',
    exact: true,
    key: 'web_resume_tag',
    role: [],
    backUrl: '',
    component: ResumeTag,
  },
  {
    path: '/admin/web/case/list',
    name: '客户案例',
    exact: true,
    key: 'web_case_list',
    role: [],
    backUrl: '',
    component: CaseList,
  },
  {
    path: '/admin/web/case/tag',
    name: '热门标签',
    exact: true,
    key: 'web_case_tag',
    role: [],
    backUrl: '',
    component: CaseTag,
  },
  {
    path: '/admin/web/activity/product',
    name: '产品活动',
    exact: true,
    key: 'web_activity_product',
    role: [],
    backUrl: '',
    component: ActivityProduct,
  },
  {
    path: '/admin/web/activity/hot',
    name: '热门活动',
    exact: true,
    key: 'web_activity_hot',
    role: [],
    backUrl: '',
    component: ActivityHot,
  },
  {
    path: '/admin/web/activity/brand',
    name: '品牌活动',
    exact: true,
    key: 'web_activity_brand',
    role: [],
    backUrl: '',
    component: ActivityBrand,
  },
  {
    path: '/admin/web/resource/list',
    name: '资源列表',
    exact: true,
    key: 'web_resource_list',
    role: [],
    backUrl: '',
    component: resourceList,
  },
  {
    path: '/admin/web/resource/column',
    name: '栏目管理',
    exact: true,
    key: 'web_resource_column',
    role: [],
    backUrl: '',
    component: resourceColumn,
  },
  {
    path: '/admin/web/resource/category',
    name: '分类管理管理',
    exact: true,
    key: 'web_resource_category',
    role: [],
    backUrl: '',
    component: resourceCategory,
  },
  {
    path: '/admin/web/resource/detail',
    roles: [],
    name: '资源详情',
    key: 'web_resource_detail',
    exact: true,
    backUrl: '',
    component: resourceDetail,
  },
  {
    path: '/admin/web/news/list',
    roles: [],
    name: '新闻列表',
    key: 'web_news_list',
    exact: true,
    backUrl: '',
    component: newsList,
  },
  {
    path: '/admin/web/news/category',
    roles: [],
    name: '标签管理',
    key: 'web_news_category',
    exact: true,
    backUrl: '',
    component: newsCategory,
  },
  {
    path: '/admin/web/news/detail',
    roles: [],
    name: '新闻详情',
    key: 'web_news_detail',
    exact: true,
    backUrl: '',
    component: newsDetail,
  },
  {
    path: '/admin/web/tdk',
    roles: [],
    name: 'tdk管理',
    key: 'web_tdk',
    exact: true,
    backUrl: '',
    component: TdkManage,
  },
  {
    path: '/admin/data/web/clue',
    roles: [],
    name: '线索管理',
    key: 'data_web_clue',
    exact: true,
    backUrl: '',
    component: dataClue,
  },
  {
    path: '/admin/data/web/resource',
    roles: [],
    name: '资源数据',
    key: 'data_web_resource',
    exact: true,
    backUrl: '',
    component: dataResource,
  },
  {
    path: '/admin/data/web/news',
    roles: [],
    name: '新闻数据',
    key: 'data_web_news',
    exact: true,
    backUrl: '',
    component: dataNews,
  },
  {
    path: '/admin/app/menu',
    roles: [],
    name: '菜单管理',
    key: 'app_menu',
    exact: true,
    backUrl: '',
    component: AppMenu,
  },
  {
    path: '/admin/app/route',
    roles: [],
    name: '路由管理',
    key: 'app_route',
    exact: true,
    backUrl: '',
    component: AppRoute,
  },
  {
    path: '/admin/app/cache',
    roles: [],
    name: '缓存管理',
    key: 'app_cache',
    exact: true,
    backUrl: '',
    component: AppCache,
  },
  {
    path: '/admin/app/permission/ui',
    roles: [],
    name: 'UI权限',
    key: 'app_permission_ui',
    exact: true,
    backUrl: '',
    component: uiPermission,
  },
  {
    path: '/admin/app/permission/url',
    roles: [],
    name: 'url权限',
    key: 'app_permission_url',
    exact: true,
    backUrl: '',
    component: urlPermission,
  },
  {
    path: '/admin/app/role',
    roles: [],
    name: '角色管理',
    key: 'app_role',
    exact: true,
    backUrl: '',
    component: roleManage,
  },
  {
    path: '/admin/userManage',
    roles: [],
    name: '用户管理',
    key: 'userManage',
    exact: true,
    backUrl: '',
    component: userManage,
  },
];

export default privateRoutes;

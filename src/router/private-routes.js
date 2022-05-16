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

// import ResumeAdd from "@pages/views/web/resume/add";
// import resourceList from "@pages/views/web/resource/list";
// import resourceDetail from "@pages/views/web/resource/detail";
// import resourceColumn from "@pages/views/web/resource/column";
// import newsList from "@pages/views/web/news/list";
// import newsDetail from "@pages/views/web/news/detail";
// import newsTag from "@pages/views/web/news/tag";
// import TdkManage from "@pages/views/web/tdk";

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
    name: '热门标签',
    exact: true,
    key: 'web_activity_product',
    role: [],
    backUrl: '',
    component: ActivityProduct,
  },
  {
    path: '/admin/web/activity/hot',
    name: '热门标签',
    exact: true,
    key: 'web_activity_hot',
    role: [],
    backUrl: '',
    component: ActivityHot,
  },
  {
    path: '/admin/web/activity/brand',
    name: '热门标签',
    exact: true,
    key: 'web_activity_brand',
    role: [],
    backUrl: '',
    component: ActivityBrand,
  },
  // {
  //   path: '/admin/web/resource/list',
  //   name: '资源列表',
  //   exact: true,
  //   key: 'web_resource_list',
  //   role: [],
  //   backUrl: '',
  //   component: resourceList,
  // },
  // {
  //   path: '/admin/web/resource/column',
  //   name: '栏目管理',
  //   exact: true,
  //   key: 'web_resource_column',
  //   role: [],
  //   backUrl: '',
  //   component: resourceColumn,
  // },
  // {
  //   path: '/admin/web/resource/detail',
  //   roles: [],
  //   name: '资源详情',
  //   key: 'web_resource_detail',
  //   exact: true,
  //   backUrl: '',
  //   component: resourceDetail,
  // },
  // {
  //   path: '/admin/web/news/list',
  //   roles: [],
  //   name: '新闻列表',
  //   key: 'web_news_list',
  //   exact: true,
  //   backUrl: '',
  //   component: newsList,
  // },
  // {
  //   path: '/admin/web/news/tag',
  //   roles: [],
  //   name: '标签管理',
  //   key: 'web_news_tag',
  //   exact: true,
  //   backUrl: '',
  //   component: newsTag,
  // },
  // {
  //   path: '/admin/web/news/detail',
  //   roles: [],
  //   name: '新闻列表',
  //   key: 'web_news_detail',
  //   exact: true,
  //   backUrl: '',
  //   component: newsDetail,
  // },
  // {
  //   path: '/admin/web/tdk',
  //   roles: [],
  //   name: 'tdk管理',
  //   key: 'web_tdk',
  //   exact: true,
  //   backUrl: '',
  //   component: TdkManage,
  // },
];

export default privateRoutes;

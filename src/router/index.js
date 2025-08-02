import { createRouter, createWebHistory } from 'vue-router';

// 导入组件
import IndexPage from '../views/IndexPage.vue'; // 首页
import LoaddataPage from '../views/LoaddataPage.vue'; // 读档页
import SavedataPage from '../views/SavedataPage.vue'; // 存档页
import DialogPage from '../views/DialogPage.vue'

const routes = [
  {
    path: '',
    name: 'Index',
    component: IndexPage,
    meta: {
      title: 'Index',
    },
  },
  {
    path: '/loaddata',
    name: 'Loaddata',
    component: LoaddataPage,
    meta: { title: 'Loaddata' }
  },
  {
    path: '/savedata',
    name: 'Savedata',
    component: SavedataPage,
    meta: { title: 'Savedata' }
  },
  {
    path: '/dialog',
    name: 'Dialog',
    component: DialogPage,
    meta: { title: 'Dialog' }
  },
  // 添加404重定向
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 全局前置守卫：更新页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '应用名称';
  next();
});

export default router;
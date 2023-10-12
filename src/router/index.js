// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
        children:[
          {
            path: 'navbar',
            name: 'Navbar',
            component: ()=>import("@/views/Navbar"),
            children:[
              {
                path:'userinfo',
                name:'Userinfo',
                component: () =>import('@/views/UserInfoInsert')
              },
              {
                path: 'server-room-info',
                name: 'Server-room-info',
                component: ()=>import('@/views/server-room-info')
              } ,
              {
                path: 'schedule-query',
                name: 'ScheduleQuery',
                component: ()=>import('@/views/schedule-query')
              },
              {
                path: 'settings',
                name: 'Settings',
                component: ()=>import('@/views/setting')
              },
              {
                path: 'search',
                name: 'Search',
                component: ()=>import('@/views/search')
              },
              {
                path: 'person',
                name: 'Person',
                component: ()=>import('@/views/person')
              }

              ]

          }
          ,{
          path: 'teacher',
            name: 'Teacher',
            component: ()=> import("@/views/teacher")
          }
        ]
      },

    ],

  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// Add route guards
router.beforeEach((to, from, next) => {
  const bypassRoutes = ['/direct', '/api', '/img', '/css', '/login', '/redirect'];
  if (bypassRoutes.includes(to.path)) {
    // Let Spring Boot handle the route
    window.location.href = to.path;
  } else {
    // Continue with Vue Router navigation
    next();
  }
});

export default router

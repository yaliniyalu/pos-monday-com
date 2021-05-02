
const routes = [
  {
    path: '/',
    component: () => import('layouts/PosLayout'),
    children: [
      { path: '', component: () => import('pages/POS') },
      { path: 'mapping', component: () => import('pages/FieldMapping') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

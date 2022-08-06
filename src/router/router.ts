import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";


const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../pages/Welcome.vue"),
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: () => import("../pages/Welcome.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

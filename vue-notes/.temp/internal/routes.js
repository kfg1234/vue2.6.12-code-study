/**
 * Generated by "@vuepress/internal-routes"
 */

import { injectComponentOption, ensureAsyncComponentsLoaded } from '@app/util'
import rootMixins from '@internal/root-mixins'
import GlobalLayout from "D:\\代码\\vue2源码学习\\vue-notes\\node_modules\\@vuepress\\core\\lib\\client\\components\\GlobalLayout.vue"

injectComponentOption(GlobalLayout, 'mixins', rootMixins)
export const routes = [
  {
    name: "v-19aff440",
    path: "/",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-19aff440").then(next)
    },
  },
  {
    path: "/index.html",
    redirect: "/"
  },
  {
    name: "v-e67ddbba",
    path: "/vue-code-study/",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-e67ddbba").then(next)
    },
  },
  {
    path: "/vue-code-study/index.html",
    redirect: "/vue-code-study/"
  },
  {
    name: "v-6a8d73d3",
    path: "/guide/",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-6a8d73d3").then(next)
    },
  },
  {
    path: "/guide/index.html",
    redirect: "/guide/"
  },
  {
    name: "v-13d7ff16",
    path: "/vue-code-study/entry/entry.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-13d7ff16").then(next)
    },
  },
  {
    name: "v-2adf1d76",
    path: "/vue-code-study/entry/",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-2adf1d76").then(next)
    },
  },
  {
    path: "/vue-code-study/entry/index.html",
    redirect: "/vue-code-study/entry/"
  },
  {
    name: "v-099cd021",
    path: "/vue-code-study/global-api/global.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-099cd021").then(next)
    },
  },
  {
    name: "v-a6b0d07e",
    path: "/vue-code-study/util/shared.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-a6b0d07e").then(next)
    },
  },
  {
    name: "v-9ee2d192",
    path: "/vue-code-study/entry/state.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-9ee2d192").then(next)
    },
  },
  {
    name: "v-be32e7f2",
    path: "/vue-code-study/util/util.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-be32e7f2").then(next)
    },
  },
  {
    name: "v-093fc73e",
    path: "/vue-code-study/window-api/window.html",
    component: GlobalLayout,
    beforeEnter: (to, from, next) => {
      ensureAsyncComponentsLoaded("Layout", "v-093fc73e").then(next)
    },
  },
  {
    path: '*',
    component: GlobalLayout
  }
]
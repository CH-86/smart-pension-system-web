import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/index.vue";
import axios from 'axios';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登录",
    },
    component: () => import("../views/login.vue"),
  },
  {
    path: "/",
    name: "Index",
    component: Index,
    children: [
      {
        path: "/home",
        name: "home",
        meta: {
          title: "社团首页",
        },
        component: () => import("../views/home.vue"),
      },
      {
        path: "/my",
        name: "my",
        meta: {
          title: "个人中心",
        },
        component: () => import("../views/my.vue"),
      },
      {
        path:"/order",
        name:"order",
        meta:{
          title:"订单中心",
        },
        component:() => import("../views/order/order.vue"),
      },
      {
        path:"/worker-doctor",
        name:"doctor",
        meta:{
          title:"医生管理",
        },
        component:() => import("../views/order/doctor.vue"),
      },
      {
        path:"/worker-nurse",
        name:"nurse",
        meta:{
          title:"护工管理",
        },
        component:() => import("../views/order/nurse.vue"),
      },
      {
        path:"/monitor-camera",
        name:"camera",
        meta:{
          title:"护工管理",
        },
        component:() => import("../views/camera.vue"),
      },
      // {
      //   path:"/worker-doctor",
      //   name:"doctor",
      //   meta:{
      //     title:"医生管理",
      //   },
      //   component:() => import("../views/order/doctor.vue"),
      // },
      {
        path:"/user",
        name:"user",
        meta:{
          title:"用户中心",
        },
        component:() => import("../views/order/user.vue"),
      },
      {
        path:"/map",
        name:"map",
        meta:{
          title:"区域地图",
        },
        component:() => import("../views/order/map.vue"),
      },
      {
        path:"/statistics",
        name:"statistics",
        meta:{
          title:"数据统计"
        },
        component:() => import("../views/order/statistics.vue")
      },
    ],
  },
  {
	path: "/error",
	name: "error",
	meta: {
		title: "错误信息",
	},
	component: () => import("../error.vue"),
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
	if(to.path.startsWith('/login')) {
		window.localStorage.removeItem('loginInfo')
		next()
	}
  else if(to.path.startsWith('/error')){
    next()
  }
  else {
    let token = window.sessionStorage.getItem('token')
    if(token){
      //console.log(token)
      next()
    }else{
      next({path: '/error'})
  }


		// let loginInfo = JSON.parse(window.localStorage.getItem('loginInfo'))
		// if (!loginInfo) {
		// 	next({path: '/login'})
		// } else {
		// 	axios.get("http://localhost:8088/jwt/checkToken", {
		// 		headers: {
		// 			token: loginInfo.token
		// 		}
		// 	}).then((response) => {
		// 		console.log(response.data)
		// 		if(!response.data) {
		// 			next({path: '/error'})
		// 		}
		// 	})
		// 	next()
		// }
	}
})

export default router;

import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import axios from 'axios';  //引入axios
import VueAxios from 'vue-axios';  // 引入vue-axios

import "./plugins/element.js";
import "./assets/icons/iconfont.css";


import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.use(VueAxios,axios);  //使用
Vue.config.productionTip = false;
Vue.prototype.$axios = axios
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");


// import AMapLoader from '@amap/amap-jsapi-loader';
// Vue.use(AMapLoader);

// import AMap from 'vue-amap';
// Vue.use(AMap);

// //初始化vue-amap
// AMap.initAMapApiLoader({
//   //高德key
//   key: 'df73b78d0a9805b3450a9c7a7a742483',

//   // 插件集合 （插件按需引入）
//   plugin: ['AMap.Geolocation',
//           'AMap.Scale',
//           'AMap.Autocomplete',
//           'AMap.PlaceSearch',
//           'AMap.OverView',
//           'AMap.ToolBar',
//           'AMap.MapType',
//           'AMap.PolyEditor',
//           'AMap.CircleEditor'
//         ]
// });



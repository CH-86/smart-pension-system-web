<template>
  <div>
    
    <!-- <div v-for="item,index in cata" :key="index">
      <span>{{item}}</span>
    </div> -->
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">养老机构分布</el-menu-item>
    <el-menu-item index="2">用户分布</el-menu-item>
    <el-menu-item index="3">疾病分布</el-menu-item>
  </el-menu>
    <!-- <button @click="mapMark">标记</button> -->

   <!-- <el-input id="tipInput" placeholder="关键词" suffix-icon="el-icon-date" v-model="searchValue"> </el-input> -->
  <div class="amap"> 
    <div class="amap_map" id="amap_map"></div>
  </div>

  <button @click="changeStyle">改变地图样式</button>
  
    
        <!-- 参考 https://www.jianshu.com/p/c461963c1271 -->
    <!-- 不推荐 -->
  <!-- 参考 https://www.cnblogs.com/wangyuxue/p/11202222.html -->
    <!-- <div  v-else-if="activeIndex == 2">
      <div :style="{width:'100%',height:'300px'}">
        <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center">
        </el-amap>
      </div>
      <div class="toolbar" >
        <span v-if="loaded">
          location: lng = {{ lng }} lat = {{ lat }}
        </span>
        <span v-else>正在定位</span>
      </div> 
    </div> -->
  </div>  
</template>

<script type="text/javascript"> window._AMapSecurityConfig = { securityJsCode:'a5501e319a74d21d1809f9ca85caaedd', } </script>
<script>
//import cata from "../data/cata_23031.json"

import AMapLoader from '@amap/amap-jsapi-loader'; //巨坑
// [Vue warn]: Error in v-on handler: "TypeError: vue_amap__WEBPACK_IMPORTED_MODULE_2___default.a.LngLat is not a constructor
// AMapLoader AMap 同时使用会产生“多次加载”问题
// import AMap from 'vue-amap';

// error INVALID_USER_SCODE

export default {
  data() {
    return {
        AMap:null,
        map:null,
        searchValue:"",
        mapStyle:"dark",
        mapStyleList:["dark","light","whitesmoke","fresh","grey" ,"graffiti","macaron" ,"blue","darkblue","wine"],

        activeIndex: '1', // 默认页

        locationData : [], //存放经纬度的数组

        cata:[],
        dataList: [{ location: ["113.772","22.785"], color: 1 },],
    };
  },
  
  methods: {
    handleSelect(key, keyPath) {
        //console.log(key, keyPath);
        this.activeIndex = key
    },

    changeStyle(){//改变地图样式
      var index = this.mapStyleList.indexOf(this.mapStyle)
      this.mapStyle = this.mapStyleList[(index+1)%this.mapStyleList.length]
      console.log(this.mapStyle)
      this.map.setMapStyle('amap://styles/'+this.mapStyle);
    },




    mapMark(){// 标点 
      var marker = new this.AMap.Marker({
          position: new this.AMap.LngLat(116.39, 39.9),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '北京'
      });

      // 将创建的点标记添加到已有的地图实例：
      this.map.add(marker);
    },

    getCity(){
      var citySearch = new this.AMap.CitySearch()
      citySearch.getLocalCity(function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          console.log(result)// 查询成功，result即为当前所在城市信息
        }
      })
    },

    toPosition(value){
      value = "杭州市桐庐县经济开发区"
      //this.AMap.
      var placeSearch = new this.AMap.PlaceSearch({ //构造地点查询类
            pageSize: 5,
            pageIndex: 1,
            map: this.map,
            panel: "panel"
      }); 
      //console.log(111111)
      // placeSearch.search(value,function(status, result){
      //   console.log(status,result)
      // });
    },
    //1e96987caaebcbd6be21d070dc4bae01
    initMap(){//d7cc75abf4e5b2bff08aef6af728dfd2	
      AMapLoader.load({//206b0730821acfaf543076ed024aae9e
          key:"1e96987caaebcbd6be21d070dc4bae01",             // 申请好的Web端开发者Key，首次调用 load 时必填
          version:"2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
          plugins:['AMap.Scale',
                  'AMap.ToolBar',
                  'AMap.ElasticMarker',
                  'AMap.Geolocation',
                  'AMap.AutoComplete',
                  'AMap.PlaceSearch',
                  'AMap.HawkEye',
                  'AMap.CitySearch',
                  'AMap.DistrictLayer'],       
                  // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      }).then((AMap)=>{
          this.map = new AMap.Map("amap_map",{  //设置地图容器id
            // pitch:45, // 地图俯仰角度，有效范围 0 度- 83 度
            // viewMode:"3D",    //是否为3D地图模式
            resizeEnable: true,
            zoom:7.8,           //初始化地图级别
            center:[121, 29.2], //初始化地图中心点位置
            mapStyle: "amap://styles/"+this.mapStyle
          });
          this.AMap = AMap
          
          this.map.addControl(new AMap.HawkEye({isOpen:false}));// 在图面添加鹰眼控件，在地图右下角显示地图的缩略图
          // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
          //that.map.addControl(new AMap.Scale());
          // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
          //that.map.addControl(new AMap.ToolBar());
          
          // // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
          // that.map.addControl(new AMap.MapType());
          // // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置

var disWorld = new AMap.DistrictLayer.World({
    zIndex:10,
    styles:{
        'nation-stroke':function(props){
            if(props.type=='Nation_Border_China'){
                return 'red'
            }else{
                return 'white'
            }
        },
        'coastline-stroke': [0.8, 0.63, 1, 1], 
        'fill':function(props){
            return getColorBySOC(props.SOC)
        }
    }
})


          // var geolocation = new AMap.Geolocation()
          // geolocation.getCurrentPosition(function(status,result){
          //   if(status=='complete'){
          //       console.log(result)
          //   }else{
          //       console.log(result)
          //   }
          // });
          //this.map.addControl(geolocation) 

          this.toPosition("")
          this.getCity()
      }).catch(e=>{
          console.log(e);
      });
    },  
  },
  created() {
    // 这行代码的意思是定义一个全局变量，等于该组件的实例
    window.my = this;
    //this.cata = cata
    //console.log(cata.length)

    
  },

  mounted() {
    this.initMap()
    
  }
};
</script>

<style scoped lang="scss" type="text/scss">
.amap {
    width: 70vw;
    height: 70vh; //80
    overflow: hidden;

    &_map {
        width: 100%;
        height: 100%;
    }
}
</style>
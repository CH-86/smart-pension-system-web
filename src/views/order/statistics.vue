<template>
    <div>
      <!-- <el-container> -->
        <el-container id="doctor">
          <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="left" type="card">
            <el-tab-pane label="科室" name="department">
            </el-tab-pane>
            <el-tab-pane label="职称" name="position">
            </el-tab-pane>
            <el-tab-pane label="所属医院" name="hospital">
            </el-tab-pane>
          </el-tabs>
          <div id="doctorC" :style="{width: '500px', height: '360px'}" ></div>
        </el-container>

        <el-container id="order">
          <div id="orderC" :style="{width: '500px', height: '360px'}" ></div>
          <!-- <div id="myChart" :style="{width: '350px', height: '350px'}"></div> -->
        </el-container>  
        <!-- <div id="doctorM" :style="{width: '300px', height: '300px'}" ></div> -->
        <!-- <div id="bintuM" :style="{width: '300px', height: '300px'}" ></div>  -->
      <!-- </el-container>   -->
    </div>
</template>

<script>
import cataJson from "../data/cata_23031.json"
export default {
  data () {
    return {
      host: "http://localhost:8088/admin",
      doctorChartByField:[],
      orderChartByField:[],

      activeName: 'position',
      msg: 'Welcome to Your Vue.js App',

      cata:[],
      cataTitle:[],
    }
  },
  mounted(){
    this.doctorInit()
    this.orderInit()
    //this.drawLine();

    this.cataInit();
    this.userInit();
    //this.bintuI();
  },
  created(){
    window.my = this;
  },
  methods: {
    handleClick(tab, event) {
        this.doctorChartByField = []
        //console.log(tab);
        this.getData('?key='+tab.name+'&collectionName=doctor',(data) =>{this.doctorChartByField = data})
        setTimeout(() =>{
          var option = { 
            title: { subtext: '按'+tab.label+'划分' },
            series: [ { data: this.doctorChartByField, } ]                
          }
          this.$echarts.init(document.getElementById('doctorC')).setOption(option)
        },300
      )
    },

    cataInit(){
      this.cataTitle = cataJson[0]
      console.log(this.cataTitle)
      this.cata = cataJson.slice(1)
      console.log(this.cata)
    },

    userInit(){
      //this.getData
    },

    orderInit(){
      this.getData('?key=type&collectionName=order', (data) => {this.orderChartByField = data});
      setTimeout(()=>{
        var option = {
          title: { 
            text: '订单分布',
            subtext: '按类型划分', 
            top: 'center',
            left: '55%',
          },
          tooltip: { trigger: 'item' },
          legend: { orient: 'vertical', left: 0},
          series: [
              {
                left:150,
                type: 'pie',
                radius: ['50%', '80%'],
                data: this.orderChartByField,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                label: {
                    normal: {
                        formatter: '{b}: {d}% ' ,
                        position: "inside"//此处将展示的文字在内部展示
                    }
                },  
              }
            ]                
        }
        this.$echarts.init(document.getElementById('orderC')).setOption(option)
      },300)      
    },

    doctorInit(){
      this.getData('?key=position&collectionName=doctor',(data) =>{this.doctorChartByField = data});
      setTimeout(()=>{
        var option = {
          title: { 
            text: '医生分布',
            subtext: '按职称划分', 
            top: 'center',
            left: '55%',
          },
          tooltip: { trigger: 'item' },
          legend: { orient: 'vertical', left: 0},
          series: [
              {
                left:150,
                type: 'pie',
                radius: ['50%', '80%'],
                data: this.doctorChartByField,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                label: {
                    normal: {
                        formatter: '{b}: {d}% ' ,
                        position: "inside"//此处将展示的文字在内部展示
                    }
                },  
              }
            ]                
        }
        this.$echarts.init(document.getElementById('doctorC')).setOption(option)
      },300)
    },

    
    getData(value, fun){
      var path = this.host +'/chart'
      this.$axios.get(path+value, 
        { headers: { token: sessionStorage.getItem("token") }, }
        ).then((res) => {
          if (res.status == 200) {
            if (!res.data) {
              console.log("非法请求" + path);
            } else {
              fun(res.data) 
            }
          }
        });      
    },



    bintuI(){
      var chartDom = document.getElementById('bintuM');
      var myChart = this.$echarts.init(chartDom);
      var option  = {
          title: { text: 'Referer of a Website', subtext: 'Fake Data', left: 'center' }, tooltip: { trigger: 'item' }, legend: { orient: 'vertical', left: 'left' },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
      myChart.setOption(option);
    },
      
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            title: { text: '医生' },
            tooltip: {},
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });
    }
  }
}
</script>

<style>
#doctor{
  widows: 220px;
  margin-bottom: 10px;
  background: rgb(224, 245, 248);
  /* border-radius: 15px; */
}
#order{
  widows: 280px;
  background: white;
}
</style>
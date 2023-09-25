<!-- <template>
	<div class="home">
		 <el-carousel :interval="4000" type="card" height="180px" indicator-position="none">
			<el-carousel-item v-for="item in lunboImg" :key="item">
				<img :src="item" alt="" />
			</el-carousel-item>
		</el-carousel> 
		<div class="show">
			<el-card class="left">
				<div slot="header" class="clearfix">
					<span style="font-size: 20px; color: #949cdf">热门社团</span>
				</div>
				<el-table :data="tableData" stripe style="width: 100%">
					<el-table-column prop="name" label="社团名称"> </el-table-column>
					<el-table-column prop="title" label="社团简介"> </el-table-column>
					<el-table-column prop="charge" label="负责人"> </el-table-column>
				</el-table>
			</el-card> -->
			<!-- <div class="right">
				<el-card class="notice">
					<div slot="header" class="clearfix">
						<span style="font-size: 16px; color: #54e346">最新公告</span>
					</div>
					<div class="notice-content" v-for="(item, index) in notice" :key="index">
						<div class="notice-item">
							<span>{{ item }}</span>
						</div>
					</div>
				</el-card>
				<el-card class="activity">
					<div slot="header" class="clearfix">
						<span style="font-size: 16px; color: #eca3f5">最新活动</span>
					</div>
					<div class="notice-content" v-for="(item, index) in activity" :key="index">
						<div class="notice-item">
							<span>{{ item }}</span>
						</div>
					</div>
				</el-card>
			</div> -->

			<!-- <el-tag
  :key="tag"
  v-for="tag in dynamicTags"
  closable
  :disable-transitions="false"
  @close="handleClose(tag)">
  {{tag}}
</el-tag>
<el-input
  class="input-new-tag"
  v-if="inputVisible"
  v-model="inputValue"
  ref="saveTagInput"
  size="small"
  @keyup.enter.native="handleInputConfirm"
  @blur="handleInputConfirm"
>
</el-input>
<el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
		</div>
	</div> 
</template> -->

<template>
  <div class="testIndex">
    <el-header style="height: 100px">
		<el-container>
			<div id="sos_count" >
				<div>
					<h3>{{'当前求助信息'}}</h3>
				</div>
				<div id="sos_count_a">
					<span style="font-weight:bold; font-size: 25rpx;"><i class="el-icon-price-tag" style="transform: rotate(90deg)" ></i>{{SOSList.length+'条'}}</span>
				</div>
			</div>
			<div id="sos_text">
				<div>
				<!-- <ul class="infinite-list" v-infinite-scroll="ulOnLoad" style="overflow:auto">
					<li v-for="i in count" class="infinite-list-item" :key="i">{{ i }}</li>
				</ul> -->
				</div>

				<h3>接收到的呼救消息:</h3>
				<span v-if="SOSList.at(-1)">{{SOSList.at(-1).code + ' 时间'}}
					{{SOSList.at(-1).time.toLocaleString().substr(0, 10)+"-"+SOSList.at(-1).time.toLocaleString().substr(11, 8)}}
					{{'坐标:'+ SOSList.at(-1).latitude+',' + SOSList.at(-1).longitude}} 
				</span>
				<!-- <span>{{SOSList.slice(-1).code + ' 时间'}}{{SOSList.slice(-1).time.substr(0, 4) + '年' + SOSList.slice(-1).time.substr(5, 2) + '月' + SOSList.slice(-1).time.substr(8, 2) + '日' +  SOSList.slice(-1).time.substr(11, 8)}}
				 -->

				<!-- { "user": "621907809928fd72b043dfdc", "code": "SOS", "latitude": 30.319126, "longitude": 120.141503, "time": "2022-03-29T07:43:41.149Z" } -->
				<!-- <div v-for="(value,index) in SOSList" :key="index">
					<span>{{value.code + ' 时间'}}{{value.time.substr(0, 4) + '年' + value.time.substr(5, 2) + '月' + value.time.substr(8, 2) + '日' +  value.time.substr(11, 8)}}
					</span>
					<span> {{'坐标:'+ value.latitude+',' + value.longitude}} </span>
				</div> -->

									<!-- <el-button style="width: 100%" >跳转</el-button> -->

			</div>
		</el-container>		
	</el-header>	


	<el-container>
		<el-aside style="width: 25%;height: 600px" >
			<el-button @click="getMapHospitalList" style="width: 100%" >重新获取周边医院</el-button>

			<el-table :data="hospitalList" style="width: 100%" :default-sort = "{prop: 'distance', order: 'asc'}" >
              <el-table-column type="expand">
                <template slot-scope="props">
					<el-descriptions :column="1" border>
						<el-descriptions-item v-if="props.row.type" label="类型" >{{props.row.type}}</el-descriptions-item>
						<el-descriptions-item v-if="props.row.address" label="地址" >{{props.row.address}}</el-descriptions-item>
						<el-descriptions-item v-if="props.row.tel" label="电话" >{{props.row.tel}}</el-descriptions-item>
					</el-descriptions>		
                </template>
              </el-table-column>
              <el-table-column label="医院名称" prop="name"> </el-table-column>
			  <el-table-column label="距离（米）" prop="distance"> </el-table-column>
            </el-table>
<!-- { "id": "B024303H2M", "name": "北苑街道幸福社区卫生计生服务站", "type": "医疗保健服务;综合医院;卫生院", "location": [ 120.05135, 29.305269 ], "address": "北苑街道凯吉路43号", "tel": "0579-85430435", "distance": 715, "shopinfo": "2" }
 -->
			<!-- <el-descriptions v-for="hospital in hospitalList" :key="hospital.id" :column="1" border>
				<el-descriptions-item v-if="hospital.name" label="名称" >{{hospital.name}}</el-descriptions-item>
				<el-descriptions-item v-if="hospital.type" label="类型" >{{hospital.type}}</el-descriptions-item>
				<el-descriptions-item v-if="hospital.address" label="地址" >{{hospital.address}}</el-descriptions-item>
				<el-descriptions-item v-if="hospital.distance" label="距离" >{{hospital.distance+'米'}}</el-descriptions-item>
				<el-descriptions-item v-if="hospital.tel" label="电话" >{{hospital.tel}}</el-descriptions-item>
			</el-descriptions>		 -->
		</el-aside>	
		<el-main style="width: 50%">
			<!-- <img src="../image/SOS.png">
			<el-image style="width: 100px; height: 100px" :src="imgSOS" ></el-image> -->
			<div class="amap"> 
				<div class="amap_map" id="amap_map"></div>
			</div>
			<button @click="changeStyle">改变地图样式</button>
		</el-main>

	<el-container style="width: 25% ; height: 80%">
		<div>
			<span>用户手机号码<a href="">{{user.phone}}</a></span>
			
			<!-- 个人信息 -->
			<!-- <span>{{user.phone}}</span> -->
			<el-descriptions class="margin-top" :column="1"  border>

				<el-descriptions-item  v-for="(item, name, index) of user.info" :key="index" >
				<template slot="label">
					<!-- <el-tag> <i class="el-icon-price-tag" style="transform: rotate(90deg)" ></i> -->
					{{ infoName[name] ? infoName[name] : name }}
					<!-- </el-tag> -->
				</template>
				<span v-if="name === 'sex'">{{ item ? "男" : "女" }}</span>
				<span v-else>{{ item }}</span>
				</el-descriptions-item>
			</el-descriptions>
			<!-- 体检表 -->
			<el-table :data="user.cases" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" v-if="user">
				<el-table-column type="expand">
				<template slot-scope="props">
					<el-table :data="mapToArray(props.row)" stripe :row-class-name="tableRowClassNameTwo" >
					<el-table-column prop="key" label="项" width="100" :formatter="keyStampToKey"></el-table-column>
					<el-table-column prop="value" label="值" width="150" :formatter="valueStampToValue"></el-table-column>
					</el-table>
				</template>
				</el-table-column>
				<el-table-column label="体检日期" prop="date" :formatter="timestampToTime" sortable >
				</el-table-column>
			</el-table>
			<!-- 备注表 -->
			<!--  -->
		</div>
	</el-container>  		  
	</el-container> 

					<!-- <el-form ref="form" :model="form" label-width="80px">
					<el-form-item label="内容">
						<el-input v-model="form.value"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit">立即发送</el-button>
						<el-button>取消</el-button>
					</el-form-item>
				</el-form>				 --> 
	<el-footer>
		<!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
			<el-menu-item index="1">养老机构分布</el-menu-item>
			<el-menu-item index="2">用户分布</el-menu-item>
			<el-menu-item index="3">疾病分布</el-menu-item>
		</el-menu> -->
	</el-footer>
	<!-- 添加右边栏Title -->
     <!-- <el-drawer
      title="用户详情"
      :visible.sync="drawer"
      direction="rtl">
    </el-drawer>	 -->
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import {timestampToTime, mapToArray} from  '../views/index'
export default {
	data() {
		return {
			activeIndex: '1', // 默认页
			mapStyleList:["dark","light","whitesmoke","fresh","grey" ,"graffiti","macaron" ,"blue","darkblue","wine"],

			hospitalMarkerList:[],
			hospitalList: [],
			host: "http://localhost:8088/admin",
			infoName: {},
			caseNameMap: {},//_caseName,
			caseValue: {},//_caseValue,
			mapToArray: mapToArray,
			timestampToTime: timestampToTime,
			SOSList:[],//[{user: '621907809928fd72b043dfdc', code: 'SOS', latitude: 32.319126, longitude: 120.141503,time: '2022-04-28T15:55:16.479Z'},{user: '621907809928fd72b043dfdc', code: 'SOS', latitude: 29.319126, longitude: 120.141503,time: '2022-04-28T15:55:16.479Z'}],
			//drawer: false,
			user:"",
			imgSOS:require('../image/SOS.png'),
			map: null,
			AMap: null,
			admin :"",
			// dynamicTags: ['标签一', '标签二', '标签三'],
			// inputVisible: false,
			// inputValue: ''
			// notice: [
			// ],
			// activity:[],
			// lunboImg: [
			// 	require("../assets/img/lunbo1.jpeg"),
			// 	require("../assets/img/lunbo2.jpeg"),
			// 	require("../assets/img/lunbo3.jpeg"),
			// 	require("../assets/img/lunbo4.jpeg"),
			// 	require("../assets/img/lunbo5.jpeg"),
			// ],
			//tableData: [],

			userPhone: "13157707730",
			socket:{},//socket创建实例对象
			path:'ws://localhost:8088/websocket/admin',//websocket需要连接的地址
			form:{name:''},

			count: 0
		};
	},
	methods: {
		ulOnLoad () {
        	this.count += 2
      	},

		handleSelect(key, keyPath) {
			console.log(key, keyPath);
			this.activeIndex = key
		},

		getMapHospitalList(){
			// 清空上一次标记过的点 hospitalMarkerList
			for(var marker of this.hospitalMarkerList){
				this.map.remove(marker)
			}

			var placeSearch = new this.AMap.PlaceSearch({ type:"医疗保健服务" });
			var that = this
			placeSearch.searchNearBy('医院',this.map.getCenter(),50000,function (status, result ){
				console.log(status, result)		
				if(status == 'complete'){
					that.hospitalList = result.poiList.pois
					for(var hospital of result.poiList.pois){
						var name = hospital.name
						var lat = hospital.location.lat//: 30.206482
						var lng = hospital.location.lng//: 120.209627
						//var type = hospital.type//type: "医疗保健服务;专科医院;口腔医院"			
						var marker = new that.AMap.Marker({
							position: new that.AMap.LngLat(lng, lat),
							title: name,
							clickable:true,
						})
						that.hospitalMarkerList.push(marker)
						that.map.add(marker)
					}
				}	
			});
		},

		SOS(data){
			var imageUrl = this.imgSOS
			var sosIcon = new this.AMap.Icon({
				// 图标尺寸
				size: new this.AMap.Size(28, 28),
				// 图标的取图地址
				image: imageUrl,
				// 图标所用图片大小
				imageSize: new this.AMap.Size(28, 28),
			});
			console.log('SOS',data.user)
			var marker = new this.AMap.Marker({
				position: new this.AMap.LngLat(data.longitude, data.latitude),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
				title: data.time,//timestampToTime(),
				icon: sosIcon,
				clickable:true,
				extData: {
					userId : data.user, 
					longitude : data.longitude,
					latitude: data.latitude
				}
			});		
			this.map.add(marker);	
			marker.on('click', this.markerClick);
		},

		markerClick(e) {
			//console.log(e.target.getExtData())
			var data = e.target.getExtData()//e.target.getExtData() 获取点击的marker属性 然后显示当前marker详情
			this.findUserById(data.userId)
			//console.log(data.longitude, data.latitude)// 经度 纬度

			// 坑 不加new 无法创建成功
			var newCenter = new this.AMap.LngLat(data.longitude, data.latitude)
			//console.log(newCenter)
			var zoom = 12// 地图比例
			this.map.setZoomAndCenter(zoom ,newCenter)
			
			setTimeout(()=>{this.getMapHospitalList()}, 2000)

			//this.getMapHospitalList()
			//this.drawer = true // 弃用
		},

		getMapCenter(){
			// KL: 124.305364
			// className: "AMap.LngLat"
			// kT: 29.292677
			// lat: 29.292677
			// lng: 124.305364
			// pos: Array(2)
			// 	0: 13837609.82335252
			// 	1: 3412950.2598280786
			var center = this.map.getCenter()
			return new this.AMap.LngLat(center.lng, center.lat)
			// console.log(center.lng,' ',center.lat)
		},		

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
						mapStyle: "amap://styles/dark"
					});
					this.AMap = AMap
					
					this.map.addControl(new AMap.HawkEye({isOpen:false}));

					for(var val of this.SOSList){
						//console.log(val)
						this.SOS(val)
					}
				}).catch(e=>{
					console.log(e);
				}
			);
		},  
		open(){
			console.log("连接成功")
		},
		error(){
				console.log("连接错误")
		},
		getMessage(res){
			//console.log("收取到的信息",res)
			if(res.data){
				let jsonObj = JSON.parse(res.data);
				console.log(jsonObj);
				if(jsonObj.code == "SOS"){
					this.SOS(jsonObj)

					const h = this.$createElement;
					this.$message({
						message: h('p', null, [
							h('span', null, '收到 '), h('i', { style: 'color: red' }, 'SOS'),
						]
						),
						duration: 2000,
						}
					);

					this.SOSList.push(jsonObj)
					// 存入数据库
				}
				// else{
				// 	this.SOSList.push(res.data)
				// }
			}
		},
		//发送信息
		onSubmit(){
			let jsonObj = {	
					form: this.admin,
					toUser:this.userPhone,
					message:this.form.value
				}
			let jsonStr = JSON.stringify(jsonObj)
			this.socket.send(jsonStr)
		},
		initWebSocket(){ //初始化weosocket
			if(typeof(WebSocket) === "undefined"){
				alert("您的浏览器不支持socket")
			}else{
				// 实例化socket
				this.socket = new WebSocket(this.path)
				// 监听socket连接
				this.socket.onopen = this.open
				// 监听socket错误信息
				this.socket.onerror = this.error
				// 监听socket消息
				this.socket.onmessage = this.getMessage
			}
		},

		findUserById(id){
			var path = this.host + "/findUserById";
			this.$axios.get(path+"?id="+id,{
				headers: { token: sessionStorage.getItem("token") },
			}).then(
				(res) =>{
					if (!res.data) {
						console.log("非法请求" + path);
					}else{
						this.user = res.data
						//console.log(this.user.info)
					}
				}
			)      
		},		

		setCases(data) {
			this.caseNameMap = data[0].nameInfo;
			this.caseValue = data[0].valueInfo;
		},

		setInfoName(data) {
			this.infoName = data[0].nameInfo;
		},		
		setInfo(type, fun) {
		var path = this.host + "/getTags";
		// console.log(path);
		this.$axios
			.get(path + "?type=" + type, {
			headers: { token: sessionStorage.getItem("token") },
			})
			.then((res) => {
			if (!res.data) console.log("非法请求" + path);
			else fun(res.data);
			});
		},	
		keyStampToKey(row){
			var key = row.key
			return this.caseNameMap[key] ? this.caseNameMap[key] : key
		},		
		valueStampToValue(row){
			var key = row.key
			var value = row.value
			return this.caseValue[key] ? " " + (typeof this.caseValue[key] === "string" ? value + " " + this.caseValue[key] : this.caseValue[key][value]) : value
		},
		tableRowClassNameTwo(row, rowIndex ){
			if (row.row.key == 'date') {
			//console.log('key is '+ row.row.key) //坑
			return 'hidden-row';
			}
			return '';
		},
		changeStyle(){//改变地图样式
			var index = this.mapStyleList.indexOf(this.mapStyle)
			this.mapStyle = this.mapStyleList[(index+1)%this.mapStyleList.length]
			console.log(this.mapStyle)
			this.map.setMapStyle('amap://styles/'+this.mapStyle);
		},		
	},
	created() {
		    // 这行代码的意思是定义一个全局变量，等于该组件的实例
    	window.my = this;
		this.admin = window.sessionStorage.getItem('admin')
		this.initWebSocket();
		this.setInfo("userInfo", this.setInfoName);
		this.setInfo("cases", this.setCases);	
	},
	destroyed() {
		this.websock.close() //离开路由之后断开websocket连接
	},
	mounted() {
		this.initMap()
	}
};
</script>


<style>
	.el-main{
		background: rgb(255, 255, 255);
		padding: 0;
	}
	.notice-item {
		width: 85%;
		height: 25px;
		display: flex;
		justify-content: left;
		align-items: center;
		margin-top: 8px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.2);
	}
	.activity {
		width: 96%;
		height: 48%;
		border-radius: 15px;
		margin-top: 4%;
	}
	.notice {
		width: 96%;
		height: 48%;
		border-radius: 15px;
	}
	.right {
		width: 45%;
		margin-left: 2%;
		margin-top: 2%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.left {
		width: 55%;
		height: 100%;
		border-radius: 2%;
		margin-top: 2%;
	}
	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}
	.clearfix:after {
		clear: both;
	}
	.el-card__body {
		padding-top: 0;
		padding-left: 20px;
	}
	.show {
		width: 96%;
		padding: 1%;
		height: 66%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.el-carousel__item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.home {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.el-carousel__item:nth-child(2n) {
		background-color: #99a9bf;
	}
	.el-carousel__item:nth-child(2n + 1) {
		background-color: #d3dce6;
	}
	.amap {
		width: 40vw;
		height: 80vh;
		overflow: hidden;
		background: rgb(206, 206, 206);
		
	}	

	.amap_map {
		/* width: 70vw;
		height: 70vh; */
		overflow: hidden;
		width: 100%;
		height: 100%;
	}

	#sos_count{
		height: 75px;
		display: flex;
		flex-direction: column; 
		margin: 0 auto 10px;
		padding: 10px 10px 10px 10px; 
		background-color: rgb(104, 205, 252);
		opacity: 0.8;
		border-radius: 10px;
	}

	#sos_count_a{
		margin: 5px 10px;
		text-align: center;
	}

	#sos_text{
		margin: 0px auto;
		background: rgb(206, 206, 206);
		border-radius: 10px;
		width: 460px;
	}
</style>

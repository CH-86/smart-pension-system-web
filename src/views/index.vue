<template>
	<el-container class="index">
		<el-aside width="{ '65px': collapse }" style="overflow: hidden">
			<el-menu class="sidebar" :default-active="onRoutes" :collapse="collapse" background-color="#1a1c21" text-color="#bfcbd9"
			 active-text-color="#20a0ff" unique-opened router>
				<div class="collapse-btn" @click="collapseChage">
					<i v-if="!collapse" class="el-icon-s-fold"></i>
					<i v-else class="el-icon-s-unfold"></i>
				</div>
				<div class="title" style="color: #fff">智慧养老系统</div>

				<template v-if="role === '1'">
					<template v-for="c in doctor">
						<el-menu-item :index="c.index" :key="c.index">
							<i :class="c.icon"></i>
							<template #title>{{ c.title }}</template>
						</el-menu-item>
					</template>
				</template> 

				<template v-else-if="role === '4'">
					<template v-for="c in nur">
						<el-menu-item :index="c.index" :key="c.index">
							<i :class="c.icon"></i>
							<template #title>{{ c.title }}</template>
						</el-menu-item>
					</template>
				</template> 

				<template v-else-if="role === '3'">
					<template v-for="c in admin">
						<!-- <template v-if="typeof c == ''"> </template> -->

						<el-menu-item :index="c.index" :key="c.index">
							<i :class="c.icon"></i>
							<template #title>{{ c.title }}</template>
						</el-menu-item>
					</template>

					<el-submenu index="worker" class="el-menu-vertical-demo" >
						<template slot="title"> <i class="el-icon-menu"></i><span>医护管理</span></template>
						<el-menu-item index="worker-doctor"><i class="el-icon-house"></i>医生管理</el-menu-item>
						<el-menu-item index="worker-nurse"><i class="el-icon-house"></i>护工管理</el-menu-item>
					</el-submenu>

					
					<!-- <el-submenu index="monitor" class="el-menu-vertical-demo" >
						<template slot="title"> <i class="el-icon-menu"></i><span>监控中心</span></template>
						<el-menu-item index="monitor-camera"><i class="el-icon-house"></i>摄像头</el-menu-item>
					</el-submenu> -->
				</template> 


			</el-menu>
		</el-aside>

		<el-container>
			<el-header height="70px" class="header">
				<div class="header-right">
					<div class="header-user-con">
						<div class="user-avator">
							<img src="../assets/img/avator.png" />
						</div>
						<div class="type">
							<span style="font-size: large;">{{ type }} | {{ loginName }}</span>
						</div>
						<div class="exit" @click="exit()">
							<i class="iconfont icon-tuichu" style="font-size: large;"></i>
						</div>
					</div>
				</div>
			</el-header>
			<el-main class="content">
				<!-- 保存组件的状态，对组件进行缓存 -->
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		data() {
			return {
				host: "http://localhost:8088/admin",
				type: '',
				loginName: '',
				role: '',
				collapse: false,
				nur:[
					// {
					// 	icon: "el-icon-house",
					// 	index: "my",
					// 	title: "个人首页"
					// },
					{
						icon: "el-icon-house",
						index: "order",
						title: "订单中心"
					},
					{
						icon: "el-icon-house",
						index: "user",
						title: "用户信息"
					},	
					{	
						icon: "el-icon-house",
						index: "statistics",
						title: "数据统计"
					},
					{
						icon: "el-icon-house",
						index: "map",
						title: "区域地图"
					}									
				],
				doctor:[
					// {
					// 	icon: "el-icon-house",
					// 	index: "my",
					// 	title: "个人首页"
					// },
					{
						icon: "el-icon-house",
						index: "home",
						title: "急救中心",
					},
					{
						icon: "el-icon-house",
						index: "order",
						title: "订单中心"
					},
					{
						icon: "el-icon-house",
						index: "user",
						title: "用户信息"
					},
					{	
						icon: "el-icon-house",
						index: "statistics",
						title: "数据统计"
					},
					{
						icon: "el-icon-house",
						index: "map",
						title: "区域地图"
					}					
				],
				admin: [
					// {
					// 	icon: "el-icon-house",
					// 	index: "my",
					// 	title: "个人首页"
					// },					
					{
						icon: "el-icon-house",
						index: "home",
						title: "首页",
					},
					{
						icon: "el-icon-house",
						index: "order",
						title: "订单中心"
					},
					{
						icon: "el-icon-house",
						index: "user",
						title: "用户信息"
					},
					// {
					// 	icon: "el-icon-house",
					// 	index: "worker-doctor",
					// 	title: "医生管理"
					// },
					// {
					// 	icon: "el-icon-house",
					// 	index: "worker-nurse",
					// 	title: "护工管理"
					// },
					{	
						icon: "el-icon-house",
						index: "statistics",
						title: "数据统计"
					},
					{
						icon: "el-icon-house",
						index: "map",
						title: "区域地图"
					}
				]
			};
		},
		computed: {
			onRoutes() {
				return this.$route.path.replace("/", "");
			},
		},
		methods: {
			findEntityById(id , namePath){
				console.log(typeof namePath, namePath)
				var path = this.host + namePath;
				console.log(typeof path, path)
				this.$axios.get(path+"?id="+id,{
					headers: { token: sessionStorage.getItem("token") },
				}).then(
					(res) =>{
					if (!res.data) {
							console.log("非法请求" + path);
						}else{
							console.log(res.data);
							return  res.data
						}
					}
				)      				
			},

			findUserById(id){
				return this.findEntityById(id, "/findUserById");
			},	

			findNurseById(id){
				return this.findEntityById(id,"/findNurseById")
			},

			findDoctorById(id){
				return this.findEntityById(id,"/findDoctorById")
			},

			collapseChage() {
				this.collapse = !this.collapse;
			},
			exit() {
				//window.localStorage.removeItem('loginInfo')
				window.sessionStorage.removeItem('admin')
				window.sessionStorage.removeItem('token')
				window.sessionStorage.removeItem('role')
				window.sessionStorage.removeItem('nearId')
				this.$router.push({
					path: '/login'
				})
			}
		},
		created() {
			this.role = window.sessionStorage.getItem("role")
			if (this.role == '1'){
				this.type = '医生'
				this.findDoctorById(window.sessionStorage.getItem('nearId'))
			}else if(this.role == '3'){
				this.type = '管理员'
			}else if(this.role == '4'){
				this.type = '护工'
				this.findNurseById(window.sessionStorage.getItem('nearId'))
			}
			this.loginName =  window.sessionStorage.getItem("admin")
		}
	};
</script>



<style>
	.index {
		width: 100%;
		height: 100%;
	}

	.header {
		font-size: 22px;
		color: black;
	}

	.header-collapse {
		left: 65px;
	}

	.collapse-btn {
		font-size: 22px;
		color: #fff;
		float: left;
		padding: 0 21px;
		cursor: pointer;
		line-height: 70px;
	}

	.title {
		width: 220px;
		line-height: 70px;
		font-size: 22px;
	}

	.sidebar {
		width: 220px;
		height: 100%;
	}

	.content {
		background: #f0f0f0;
	}
	
	.header-right {
	    float: right;
	    padding-right: 50px;
	}
	
	.header-user-con {
	    display: flex;
	    height: 70px;
	    align-items: center;
	}
	
	.user-avator img {
	    display: block;
	    width: 40px;
	    height: 40px;
		border-radius: 50%;
	}
	
	.type {
		margin-left: 20px;
	}
	
	.exit {
		margin-left: 20px;
	}
</style>

<template>
	<div class="login">
		<el-form ref="login" class="login-form" :model="loginInfo" :rules="loginRules">
			<h2 class="title">智慧养老系统</h2>
			<el-form-item prop="admin">
				<el-input type="text" placeholder="账号" v-model="loginInfo.admin">
					<template #prepend>
						<el-button icon="iconfont icon-wode"></el-button>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" placeholder="密码" v-model="loginInfo.password" @keyup.enter="login()">
					<template #prepend>
						<el-button icon="iconfont icon-mima"></el-button>
					</template>
				</el-input>
			</el-form-item>
			<!-- <el-radio-group v-model="loginInfo.type" @change="loginInfoChange">
				<el-radio :label="1">医生</el-radio>
				<el-radio :label="4">护理</el-radio>
				<el-radio :label="3">管理员</el-radio>
			</el-radio-group> -->
			<span style="color:red">{{message}}</span>
			<el-form-item style="width: 350px; margin-top: 5%">
				<el-button size="medium" type="primary" style="width: 100%" @click="login()">登&nbsp;录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				message:"",
				loginInfo: {
					 admin: "root",
					 password: "123",
					//type: 3,
				},
				loginRules: {
					admin: [{
						required: true,
						message: "用户名不能为空",
						trigger: "blur"
					}, ],
					password: [{
						required: true,
						message: "密码不能为空",
						trigger: "blur"
					}, ],
				},
			};
		},
		methods: {
			loginInfoChange(index){
				//console.log(index)
				// if(index == 1){
				// 	this.loginInfo.admin = "doc"
				// }
				// else if (index == 3){
				// 	this.loginInfo.admin = "root"
				// }
				// else if (index == 4){
				// 	this.loginInfo.admin = "nur"
				// }
			},

			login() {
				var _this = this;
				// if (this.loginInfo.type){
					this.$axios.post("http://localhost:8088/admin/login", _this.loginInfo
					).then(
						res => {
							if(res.status == 200) {
								//console.log("login ok", res.data)
								if(res.data.message){
									//alert(res.data.message)
									this.message = res.data.message
								}
								if(res.data.name){
									sessionStorage.setItem('admin', res.data['name'])
									sessionStorage.setItem('token', res.data['token'])
									sessionStorage.setItem('role', res.data['type'])
									if(res.data.nearId){
										sessionStorage.setItem('nearId', res.data.nearId)
									}
									this.$router.push({path:"/home"})
								}
							}
							else{
								alert("系统错误")
							}
						}
					)
				//}

				// if (this.loginInfo.type == 1) {
				// 	this.$axios.post("http://localhost:8088/admin/login", _this.loginInfo.username, {
				// 		headers: {
				// 			'content-Type': 'appliaction/x-www-form-urlencoded'
				// 		}
				// 	}).then(res => {
				// 		if (res.status == 200) {
				// 			if (res.data.length != 0) {
				// 				if (res.data.loginInfo.password == _this.loginInfo.password) {
				// 					localStorage.setItem('loginInfo', JSON.stringify(res.data))
				// 					console.log(JSON.parse(localStorage.getItem('loginInfo')))
				// 					this.$refs.login.validate((valid) => {
				// 						if (valid) {
				// 							this.$router.push({
				// 								path: "/home"
				// 							});
				// 						} else {
				// 							return false;
				// 						}
				// 					});
				// 				} else {
				// 					alert("密码错误")
				// 				}
				// 			} else {
				// 				alert("账号不存在")
				// 			}
				// 		} else {
				// 			console.log("数据异常")
				// 		}
				// 	})
				// } else {
				// 	var obj = {
				// 	    "stunum": _this.loginInfo.username,
				// 		"password": _this.loginInfo.password
				// 	}
				// 	this.$axios.post("http://localhost:8088/user/login", JSON.stringify(obj),{
				// 		headers: {
				// 			'content-Type': 'application/json;charset=UTF-8'
				// 		}					
				// 	}).then(res => {
				// 		if (res.status == 200) {
				// 			if (res.data.length != 0) {
				// 				localStorage.setItem('loginInfo', JSON.stringify(res.data))
				// 				console.log(JSON.parse(localStorage.getItem('loginInfo')))
				// 				this.$refs.login.validate((valid) => {
				// 					if (valid) {
				// 						this.$router.push({
				// 							path: "/home"
				// 						});
				// 					} else {
				// 						return false;
				// 					}
				// 				});
				// 			} else {
				// 				alert("账号或密码错误")
				// 			}
				// 		} else {
				// 			console.log("数据异常")
				// 		}
				// 	})
				// }

			},
		},
		beforeCreate() {
			//window.localStorage.removeItem("loginInfo")
			window.sessionStorage.removeItem('admin')
			window.sessionStorage.removeItem('token')
			window.sessionStorage.removeItem('role')
			window.sessionStorage.removeItem('nearId')
		}
	};
</script>


<style rel="stylesheet/scss" lang="scss">
	.login {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		background-image: url("../image/login-background.jpeg");
		background-size: cover;
		opacity: 1;
	}

	.title {
		margin: 0px auto 30px auto;
		text-align: center;
		color: #000000;
	}

	.login-form {
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		border-radius: 6px;
		background: #ffffff;
		width: 400px;
		padding: 5px 25px 5px 25px;
		box-shadow: #afb9c8 10px 10px 20px;
		opacity: 0.8;

		.el-input {
			width: 350px;
			height: 38px;
		}
	}
</style>

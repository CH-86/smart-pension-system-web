<template>
	<div></div>
</template>

<script>
	export default {
		name: 'Error',
		created() {
			let _this = this
			this.$alert('登录信息失效!请重新登录', '提示', {
				confirmButtonText: '确定'
			}).then((response) => {
				window.localStorage.removeItem('loginInfo')
				_this.$router.replace({ path: '/login' })
			})
		}
	}
</script>

<style>
</style>

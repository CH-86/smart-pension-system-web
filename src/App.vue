<template>
	<div id="app">
		<router-view v-if="isRouterAlive"/>
	</div>
</template>

<script>
	export default {
		provide() {
			return {
				reload: this.reload
			}
		},
		data () {
			return {
				isRouterAlive: true
			}
		},
		methods: {
			reload() {
				this.isRouterAlive = false
				this.$nextTick(function(){
					this.isRouterAlive = true
				})
			}
		}
	}
	
</script>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	#app {
		width: 100vw;
		height: 100vh;
	}
	
	.footer {
		width: 80%;
		position: absolute;
		bottom: 20px;
		display: flex;
		justify-content: center;
	}
	
	.pagination {
		text-align: center;
	}
</style>

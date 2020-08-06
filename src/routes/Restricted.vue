<template>
	<router-view></router-view>
</template>

<script>
import Login from "@/routes/Restricted/Login";

export const routes = [
	{ path: '/login', component: Login, name: 'login' },
	{ path: '*', redirect: '/login' },
];

export default {
	name: "Restricted"
}
</script>

<style scoped>

</style>

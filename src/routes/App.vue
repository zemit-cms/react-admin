<template>
	<v-app>
		<Toolbar />
		<Sidebar />
		<History />

		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script>
import Dashboard from "@/routes/App/Dashboard";
import Account from "@/routes/App/Account";
import Toolbar from "@/shared/Toolbar";
import Sidebar from "@/shared/Sidebar";
import History from "@/shared/History";

export const routes = [
	{ path: '/', component: Dashboard, name: 'dashboard' },
	{ path: '/account/:section', component: Account, name: 'account' },
	{ path: '/account', redirect: '/account/details' },
	{ path: '/medias', component: Dashboard, name: 'medias' },
	{ path: '/apis/:name', component: Dashboard, name: 'apis' },
];

export default {
	name: "App.vue",

	components: { Toolbar, Sidebar, History },

	mounted() {
		this.$shortcuts.attach(document.body);
	},

	unmounted() {
		this.$shortcuts.detach();
	},
}
</script>

<style scoped>

</style>

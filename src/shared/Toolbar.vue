<template>
	<v-app-bar :color="color" clipped-right flat outlined dense app>

		<v-tooltip bottom>
			<template v-slot:activator="{ on, attrs }">
				<v-btn v-on="on" to="/" icon>
					<v-img :src="logo" max-height="24" max-width="24" contain />
				</v-btn>
			</template>
			<span v-text="$t('toolbar.home')"></span>
		</v-tooltip>

		<v-icon class="mx-2">mdi-chevron-right</v-icon>

		<v-toolbar-title class="subtitle-1">
			<div>Breadcrumb</div>
		</v-toolbar-title>

		<v-spacer></v-spacer>

		<!-- BOOKMARK -->
		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn icon v-on="on">
					<v-icon>mdi-star-outline</v-icon>
				</v-btn>
			</template>
			<span v-text="$t('btn.addBookmark')"></span>
		</v-tooltip>

		<!-- LANGUAGES -->
		<LanguageSwitcher />

		<!-- OPTIONS -->
		<v-menu offset-y>
			<template v-slot:activator="{ on: menu }">
				<v-tooltip bottom>
					<template v-slot:activator="{ on: tooltip, attrs }">
						<v-btn text v-on="{ ...menu, ...tooltip }" icon>
							<v-icon>mdi-dots-vertical</v-icon>
						</v-btn>
					</template>
					<span v-text="$t('btn.options')"></span>
				</v-tooltip>
			</template>
			<v-list nav>
				<v-list-item v-for="(item, index) in options" :key="index" @click="item.callback">
					<v-list-item-icon>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>
					<v-list-item-title>{{ item.title }}</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
	</v-app-bar>
</template>

<script>
import logoDark from '../assets/logo-dark.svg';
import logoLight from '../assets/logo-light.svg';
import LanguageSwitcher from "@/shared/LanguageSwitcher";

export default {
	name: "Toolbar",

	components: { LanguageSwitcher },

	computed: {

		logo() {
			return this.$vuetify.theme.dark ? logoLight : logoDark;
		},

		options() {
			return [
				{ title: this.$vuetify.theme.dark ? this.$t('toolbar.lightMode') : this.$t('toolbar.darkMode'), icon: 'mdi-theme-light-dark', callback: () => {
					this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
				}},
			]
		},

		color() {
			return this.$vuetify.theme.dark ? '#363636' : 'white';
		},
	},
}
</script>

<style scoped>
	.theme--light.v-application .v-toolbar {
		height: 49px !important;
		border-bottom: rgba(0, 0, 0, 0.12) solid 1px !important;
	}
	.theme--dark.v-application .v-toolbar {
		height: 49px !important;
		border-bottom: rgba(255, 255, 255, 0.12) solid 1px !important;
	}
</style>

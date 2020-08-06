<template>
	<v-sheet>
		<v-card tile flat>
			<v-img :src="image" :gradient="gradient" max-height="33vh" :aspect-ratio="4" class="align-center pa-8">
				<div class="d-flex">
					<Avatar :user="user" class="elevation-4" size="128" />
					<div class="d-flex flex-column justify-center pl-8">
						<div class="title" v-text="user.completeName"></div>
						<div class="subtitle-1" v-text="user.role"></div>
					</div>
				</div>
			</v-img>
		</v-card>
		<v-divider></v-divider>
		<v-tabs>
			<v-tab>Details</v-tab>
			<v-tab>Settings</v-tab>
		</v-tabs>
	</v-sheet>

</template>

<script>
import Avatar from "@/shared/Avatar";
import { UserModel } from "@zemit/sdk-js";

export default {
	name: "Header",

	components: { Avatar },

	props: {
		user: {
			type: UserModel,
			default: () => new UserModel(),
		}
	},

	computed: {

		image() {
			return '';
		},

		gradient() {
			return this.$vuetify.theme.dark
				? 'to top, rgba(255, 255, 255, 0), rgba(255, 255, 255, .1)'
				: 'to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.05)'
		}
	},
}
</script>

<style scoped>

</style>

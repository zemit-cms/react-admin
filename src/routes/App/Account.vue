<template>
	<v-sheet>
		<Header :user="user" />
	</v-sheet>
</template>

<script>
import Header from './Account/Header';
import { UserModel } from "@zemit/sdk-js";

export default {
	name: "Account",

	components: { Header },

	data() {
		return {
			user: new UserModel({
				firstName: 'Jane',
				lastName: 'Smith',
				role: 'Member',
			}),
		}
	}
}
</script>

<style scoped>

</style>

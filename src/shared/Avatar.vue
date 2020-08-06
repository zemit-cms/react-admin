<template>
	<v-avatar v-bind="$attrs" v-on="$listeners">
		<img :src="user.avatar" :alt="user.completeName" />
	</v-avatar>
</template>

<script>
import {UserModel} from "@zemit/sdk-js";

export default {
	name: "Avatar",

	props: {
		user: {
			type: UserModel,
			default: () => new UserModel(),
		}
	},
}
</script>

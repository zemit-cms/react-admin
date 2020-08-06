<template>
	<v-menu offset-y v-bind="$attrs.menuProps">
		<template v-slot:activator="{ on: menu }">
			<v-tooltip bottom>
				<template v-slot:activator="{ on: tooltip, attrs }">
					<v-btn text v-on="{ ...menu, ...tooltip }" v-bind="$attrs.btnProps">
						<v-icon left>mdi-translate</v-icon>
						<span v-text="currentLanguage.abbr"></span>
						<v-icon right>mdi-chevron-down</v-icon>
					</v-btn>
				</template>
				<span v-text="$t('languageSwitcher.switchLanguage')"></span>
			</v-tooltip>
		</template>
		<v-list nav>
			<v-list-item-group v-model="selectedIdx" color="primary" mandatory>
				<v-list-item v-for="(language, languageIdx) in languages" :key="languageIdx" @click="setLanguage(language)">
					<v-list-item-title>{{ language.title }}</v-list-item-title>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-menu>
</template>

<script>
import moment from 'moment';

export default {
	name: "LanguageSwitcher",

	methods: {

		setLanguage(language) {
			this.$i18n.locale = language.abbr;
		},
	},

	computed: {

		currentLanguage() {
			return this.languages.find(language => language.abbr === this.$i18n.locale);
		},
	},

	data() {
		const languages = [
			{ abbr: 'en', title: 'English', },
			{ abbr: 'fr', title: 'Francais', },
		];
		return {
			languages,
			selectedIdx: languages.findIndex(language => language.abbr === this.$i18n.local),
		}
	},

	watch: {

		selectedIdx(locale) {
			moment.locale(this.currentLanguage.abbr);
		}
	}
}
</script>

<style scoped>

</style>

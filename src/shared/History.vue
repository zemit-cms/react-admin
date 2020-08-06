<template>
	<v-navigation-drawer :width="width" app right clipped permanent>

		<!-- HEADER -->
		<template v-slot:prepend>
			<div class="d-flex align-center px-2">
				<div class="shrink">
					<v-btn icon small>
						<v-icon small>mdi-history</v-icon>
					</v-btn>
				</div>
				<v-subheader class="overflow-hidden px-2 grow">
					<div class="text-truncate" v-text="$t('history.title')"></div>
				</v-subheader>
				<div class="overline shrink">
					<span v-text="$tc('history.totalItems', histories.length, { total: histories.length })"></span>
				</div>
			</div>
			<v-divider></v-divider>
		</template>

		<!-- LINKS -->
		<v-list v-if="!hasHistory">
			<v-list-item>
				<v-list-item-content class="d-flex flex-nowrap">
					<v-icon class="shrink" disabled>mdi-alert</v-icon>
					<span class="grow ml-4" v-text="$t('history.noItem')"></span>
				</v-list-item-content>
			</v-list-item>
		</v-list>
		<GroupedYearMonth v-else class="pa-4" :items="histories">
			<template v-slot:items="props">
				<v-timeline align-top dense>
					<v-timeline-item v-for="(item, itemIdx) in props.items" :color="item.color" small>
						<strong>{{ item.date | formattedDate }}</strong>
						<div v-text="item.type"></div>
					</v-timeline-item>
				</v-timeline>
			</template>
		</GroupedYearMonth>

		<template v-slot:append>
			<div v-if="hasMore" class="pa-4">
				<v-btn @click="loadMore()" :disabled="loading" :loading="loading" text block>
					<v-icon left>mdi-chevron-down</v-icon>
					<span v-text="$t('btn.loadMore')"></span>
				</v-btn>
			</div>
		</template>
	</v-navigation-drawer>
</template>

<script>
import GroupedYearMonth from "@/shared/GroupedYearMonth";
import moment from 'moment';

export default {
	name: "History",

	components: { GroupedYearMonth },

	created() {
		this.load();
	},

	methods: {

		load() {
			this.hasMore = true;
		},

		handleHistoryClick() {

		},

		loadMore() {
			this.loading = true;
			setTimeout(() => {
				this.loading = false;
				this.hasMore = false;
			}, 1000);
		},
	},

	filters: {

		formattedDate(date) {
			return moment(date).format('Do @ LT');
		},
	},

	computed: {

		hasHistory() {
			return this.histories.length > 0;
		},
	},

	data() {
		return {
			loading: false,
			hasMore: false,
			width: 250,
			histories: [
				{ color: 'warning', date: '2020-07-04 10:30:10', type: 'updated' },
				{ color: 'error', date: '2020-07-02 10:30:10', type: 'deleted' },
				{ color: 'warning', date: '2020-05-04 10:30:10', type: 'updated' },
				{ color: 'primary', date: '2019-11-04 10:30:10', type: 'created' },
			],
		}
	}
}
</script>

<style scoped>

</style>

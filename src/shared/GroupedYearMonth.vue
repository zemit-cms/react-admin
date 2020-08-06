<template>
	<div>
		<template v-for="year in nested">
			<slot name="year" :year="year">
				<div class="title" v-text="year.text"></div>
			</slot>
			<template v-for="month in year.months">
				<slot name="month" :month="month">
					<div class="subtitle-1" v-text="month.text"></div>
				</slot>
				<slot name="items" :items="month.items">

				</slot>
			</template>
		</template>
	</div>
</template>

<script>
import moment from 'moment';

export default {
	name: "GroupedYearMonth",

	props: {
		items: {
			type: Array,
			default: () => [],
		},
		dateKey: {
			type: String,
			default: 'date',
		},
		yearFormat: {
			type: String,
			default: 'YYYY',
		},
		monthFormat: {
			type: String,
			default: 'MMMM',
		},
	},

	computed: {

		nested() {
			const nested = [];
			this.items.forEach(item => {
				const year = moment(item[this.dateKey]).format(this.yearFormat);
				const month = moment(item[this.dateKey]).format(this.monthFormat);

				let yearContext = nested.find(item => item.value === year);
				if (!yearContext) {
					yearContext = {
						text: year,
						value: year,
						months: [],
					};
					nested.push(yearContext);
				}

				let monthContext = yearContext.months.find(item => item.value === month);
				if (!monthContext) {
					monthContext = {
						text: month,
						value: month,
						items: [],
					};
					yearContext.months.push(monthContext);
				}

				monthContext.items.push(item);
			});

			return nested;
		},
	},
}
</script>

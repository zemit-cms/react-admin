<template>
	<v-navigation-drawer :width="width" app left permanent>
		<div class="d-flex fill-height flex-nowrap" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">

			<!-- SIGN OUT DIALOG -->
			<v-dialog v-model="signOutDialog.visible" width="300">
				<v-card>
					<v-card-title>
						<v-icon left>mdi-logout-variant</v-icon>
						<span v-text="$t('btn.signOut')"></span>
					</v-card-title>

					<v-card-text>
						<span v-text="$t('dialog.signOutDesc')"></span>
					</v-card-text>

					<v-divider></v-divider>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" text @click="signOut()">
							<span v-text="$t('btn.signOut')"></span>
						</v-btn>
						<v-btn text @click="signOutDialog.visible = false">
							<span v-text="$t('btn.cancel')"></span>
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<!-- MINI DRAWER -->
			<v-navigation-drawer class="app-drawer" :width="appWidth" :mini-variant="mini" :mini-variant-width="miniWidth" permanent>

				<!-- AVATAR -->
				<template v-slot:prepend>
					<v-tooltip right>
						<template v-slot:activator="{ on, attrs }">
							<v-list-item v-on="mode !== 'apps' && on" to="/account" class="px-2" two-line>
								<v-list-item-avatar>
									<img :src="user.avatar" :alt="user.completeName">
								</v-list-item-avatar>
								<v-list-item-content>
									<v-list-item-title v-text="user.completeName"></v-list-item-title>
									<v-list-item-subtitle v-text="user.role"></v-list-item-subtitle>
								</v-list-item-content>
								<v-list-item-icon class="my-0">
									<v-tooltip left>
										<template v-slot:activator="{ on, attrs }">
											<v-btn class="mt-4" v-on="on" @mousedown.stop @click="handlePin" icon>
												<v-icon v-if="pinned" small>mdi-pin</v-icon>
												<v-icon v-else small>mdi-pin-off</v-icon>
											</v-btn>
										</template>
										<span>
										<span v-if="pinned" v-text="$t('sidebar.unfix')"></span>
										<span v-else v-text="$t('sidebar.fix')"></span>
									</span>
									</v-tooltip>
								</v-list-item-icon>
							</v-list-item>
						</template>
						<span v-text="$t('sidebar.myAccount')"></span>
					</v-tooltip>
				</template>

				<!-- SEARCH -->
				<div style="flex: 0">
					<v-list dense nav>
						<v-text-field v-if="mode === 'apps'" ref="search" @blur="handleSearchBlur" v-model="query" class="search-input" color="primary" :placeholder="$t('sidebar.searchPlaceholder')" :loading="searching" prepend-inner-icon="mdi-magnify" autocomplete="off" @keyup="handleSearchKeyUp" solo flat clearable hide-details></v-text-field>
						<v-tooltip v-else right>
							<template v-slot:activator="{ on, attrs }">
								<v-list-item class="ma-0" v-on="mode !== 'apps' && on" @click="handleSearch">
									<v-list-item-action>
										<v-icon>mdi-magnify</v-icon>
									</v-list-item-action>
									<v-list-item-content>
										<v-list-item-title v-text="$t('btn.search')"></v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</template>
							<span v-text="$t('btn.search')"></span>
						</v-tooltip>
					</v-list>
				</div>

				<v-divider class="mt-2 d-block"></v-divider>

				<div :style="{
					flex: 1,
					width: appWidth + 'px'
				}">

					<!-- FILTERED RESULTS -->
					<v-list v-if="mode === 'apps' && filteredItems !== null" nav>
						<v-list-item v-if="filteredItems.length === 0">
							<v-list-item-content>
								<div class="d-flex flex-nowrap">
									<v-icon class="shrink" disabled>mdi-alert</v-icon>
									<span class="ml-4" v-text="$t('sidebar.filteredItemsEmpty')"></span>
								</div>
							</v-list-item-content>
						</v-list-item>
						<v-list-item @click="handleMenuItemClick(link)" v-for="(link, linkIdx) in filteredItems" :to="link.to" :key="linkIdx" link>
							<v-list-item-action>
								<v-icon v-text="link.icon"></v-icon>
							</v-list-item-action>
							<v-list-item-content>
								<v-list-item-title class="text-truncate" v-text="$t('links.' + link.key)"></v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>

					<!-- APPs -->
					<v-list v-else two-line dense nav>
						<v-list-item-group v-model="selectedLinkIdx" color="primary" mandatory>
							<v-tooltip v-for="(link, linkIdx) in links" :key="link.key" right>
								<template v-slot:activator="{ on, attrs }">
									<v-list-item @click="handleMenuItemClick(linkIdx)" :to="link.to" v-on="mode !== 'apps' && on">
										<v-list-item-action>
											<v-icon v-text="link.icon"></v-icon>
										</v-list-item-action>
										<v-list-item-content>
											<v-list-item-title v-text="$t('links.' + link.key)"></v-list-item-title>
											<v-list-item-subtitle v-text="$t('links.' + link.key + 'Desc')"></v-list-item-subtitle>
										</v-list-item-content>
									</v-list-item>
								</template>
								<span v-text="$t('links.' + link.key)"></span>
							</v-tooltip>
						</v-list-item-group>
					</v-list>
				</div>

				<template v-slot:append>
					<v-list dense nav>

						<!-- PIN DRAWER BUTTON -->
						<v-fade-transition>
							<div v-if="mini" class="pb-6 mx-n4">
								<v-divider class="d-block"></v-divider>
								<v-tooltip right>
									<template v-slot:activator="{ on, attrs }">
										<v-btn class="pa-0 elevation-0" v-on="on" @mousedown.stop @click="handleExpand" absolute :style="{
											bottom: '4rem',
											left: '0.75rem',
											border: 'rgba(255, 255, 255, 0.25) solid 1px'
										}" fab x-small>
											<v-icon small>mdi-chevron-right</v-icon>
										</v-btn>
									</template>
									<span v-text="$t('sidebar.expand')"></span>
								</v-tooltip>
							</div>
						</v-fade-transition>

						<!-- SIGN-OUT -->
						<v-tooltip right>
							<template v-slot:activator="{ on, attrs }">
								<v-list-item v-on="mode !== 'apps' && on" @click="handleSignOut()">
									<v-list-item-action>
										<v-icon>mdi-logout-variant</v-icon>
									</v-list-item-action>
									<v-list-item-content>
										<v-list-item-title v-text="$t('btn.signOut')"></v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</template>
							<span v-text="$t('btn.signOut')"></span>
						</v-tooltip>
					</v-list>
				</template>
			</v-navigation-drawer>

			<!-- MENU ITEMS -->
			<v-expand-x-transition>
				<div v-if="showSubPanel" style="flex: 1 !important">
					<div class="d-flex flex-column fill-height" :style="{
						width: (baseWidth - miniWidth) + 'px'
					}">

						<!-- MAIN LINKS -->
						<div class="grow">
							<div class="d-flex align-center px-2">
								<div class="shrink">
									<v-btn v-if="deepness > 0" @click="handleSectionBack" icon small>
										<v-icon small>mdi-chevron-left</v-icon>
									</v-btn>
									<v-btn v-else icon small disabled>
										<v-icon small v-text="links[selectedLinkIdx].icon"></v-icon>
									</v-btn>
								</div>
								<v-subheader class="overflow-hidden px-2 grow">
									<div class="text-truncate" v-text="$t('links.' + sections[deepness].key)"></div>
								</v-subheader>
								<div class="shrink">
									<v-tooltip left>
										<template v-slot:activator="{ on, attrs }">
											<v-btn v-on="on" @click="handlePin" icon small>
												<v-icon v-if="pinned" small>mdi-pin</v-icon>
												<v-icon v-else small>mdi-pin-off</v-icon>
											</v-btn>
										</template>
										<span>
											<span v-if="pinned" v-text="$t('sidebar.fix')"></span>
											<span v-else v-text="$t('sidebar.unfix')"></span>
										</span>
									</v-tooltip>
								</div>
							</div>
							<v-divider></v-divider>

							<!-- LINKS -->
							<v-list v-if="!hasLinks">
								<v-list-item>
									<v-list-item-content class="d-flex flex-nowrap">
										<v-icon class="shrink" disabled>mdi-alert</v-icon>
										<span class="grow ml-4" v-text="$t('sidebar.noItem')"></span>
									</v-list-item-content>
								</v-list-item>
							</v-list>
							<v-window v-else v-model="deepness">
								<v-window-item v-for="(section, sectionIdx) in sections" :key="sectionIdx">
									<v-list dense nav>
										<template v-for="(link, linkIdx) in section.childs">
											<v-tooltip :key="linkIdx" right>
												<template v-slot:activator="{ on, attrs }">
													<v-list-item color="primary" @click="handleMenuItemClick(link)" :to="link.to" v-on="mini && on" link>
														<v-list-item-icon>
															<v-icon v-text="link.icon"></v-icon>
														</v-list-item-icon>
														<v-list-item-content>
															<v-list-item-title class="text-truncate" v-text="$t('links.' + link.key)"></v-list-item-title>
														</v-list-item-content>
														<v-list-item-icon v-if="link.childs && link.childs.length > 0">
															<v-icon>mdi-chevron-right</v-icon>
														</v-list-item-icon>
													</v-list-item>
												</template>
												<span v-text="$t('links.' + link.key)"></span>
											</v-tooltip>
										</template>
									</v-list>
								</v-window-item>
							</v-window>
						</div>

						<!-- BOOKMARKS -->
						<div class="shrink">
							<v-divider></v-divider>
							<div class="shrink d-flex align-center">
								<div class="shrink">
									<v-btn small icon disabled>
										<v-icon small>mdi-star</v-icon>
									</v-btn>
								</div>
								<v-subheader class="overflow-hidden px-2">
									<div class="text-truncate" v-text="$t('sidebar.bookmarks')"></div>
								</v-subheader>
							</div>
							<v-divider></v-divider>
							<v-list v-if="bookmarks.length === 0">
								<v-list-item>
									<v-list-item-content class="d-flex flex-nowrap">
										<v-icon class="shrink" disabled>mdi-alert</v-icon>
										<span class="grow ml-4" v-text="$t('sidebar.noBookmarks')"></span>
									</v-list-item-content>
								</v-list-item>
							</v-list>
							<v-list v-else nav>
								<v-list-item @click="handleMenuItemClick(link)" v-for="(link, linkIdx) in bookmarks" :to="link.to" :key="linkIdx" link>
									<v-list-item-action>
										<v-icon v-text="link.icon"></v-icon>
									</v-list-item-action>
									<v-list-item-content>
										<v-list-item-title class="text-truncate" v-text="$t('links.' + link.key)"></v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-list>
						</div>
					</div>
				</div>
			</v-expand-x-transition>
		</div>
	</v-navigation-drawer>
</template>

<script>
import {UserModel} from "@zemit/sdk-js";

let miniOpenTimeout, miniCloseTimeout, searchTimeout;

export default {
	name: "Sidebar",

	created() {
		this.resetSections();
	},

	mounted() {
		this.$shortcuts.add('Search', 'Quickly find pages and items', 'main', ['ControlLeft', 'KeyF'], this.shortcutSearch);
	},

	destroyed() {
		this.$shortcuts.remove(this.shortcutSearch);
	},

	methods: {

		shortcutSearch(event) {
			this.handleSearch();
			event.preventDefault();
		},

		handleMouseEnter(event, timeout = 2000) {
			clearTimeout(miniOpenTimeout);
			clearTimeout(miniCloseTimeout);
			miniOpenTimeout = setTimeout(() => this.hovering = true, timeout);
		},

		handleMouseLeave(event, timeout = 500) {
			clearTimeout(miniOpenTimeout);
			clearTimeout(miniCloseTimeout);
			miniCloseTimeout = setTimeout(() => {
				this.hovering = false;
				this.forceOpen = false;
				this.forceSearch = false;
			}, timeout);
		},

		handleSearch() {
			clearTimeout(miniOpenTimeout);
			clearTimeout(miniCloseTimeout);
			this.forceSearch = true;
			this.forceOpen = true;
			this.$nextTick(() => {
				this.$refs.search.$el.querySelector('input').focus();
			});
		},

		handleSearchBlur() {
			this.forceSearch = false;
		},

		handleMenuItemClick(link) {

			if (link.childs && link.childs.length > 0) {
				this.sections.push(link);
				this.$nextTick(() => this.deepness++);
			} else {
				this.hovering = false;
			}

			if (link.to) {

			}
		},

		handlePin() {
			this.pinned = !this.pinned;
		},

		handleExpand() {
			this.forceOpen = true;
		},

		handleSectionBack() {
			this.deepness--;
		},

		handleSignOut() {
			clearTimeout(miniOpenTimeout);
			clearTimeout(miniCloseTimeout);
			this.signOutDialog.visible = true;
		},

		handleSearchKeyUp(event) {
			switch (event.key) {
				case 'Escape':
					this.query = null;
					if (!this.hovering) {
						this.handleMouseLeave(null,0);
					}
					break;
			}
		},

		resetSections() {
			this.sections = [this.links[this.selectedLinkIdx]];
			this.deepness = 0;
		},

		search(query) {

			query = (query || '').toLowerCase().trim();
			if (query === '') {
				this.filteredItems = null;
				return;
			}

			this.searching = true;
			setTimeout(() => {

				const cb = (childs) => {
					childs.forEach(child => {
						if (child.childs) {
							cb(child.childs);
						} else if (this.$t('links.' + child.key).toLowerCase().indexOf(query) !== -1) {
							this.filteredItems.push(child);
						}
					});
				};
				this.filteredItems = [];
				cb(this.links);

				this.searching = false;
			}, 500);
		},

		signOut() {
			this.signOutDialog.visible = false;
		},
	},

	computed: {

		mode() {

			if (this.forceSearch) {
				return 'apps';
			}

			if ((!this.hasLinks || !this.pinned) && !this.forceOpen) {
				return 'mini';
			}

			if (!this.hasLinks) {
				return 'apps';
			} else {
				return 'links';
			}
		},

		links() {
			return [
				{ key: 'accessControl', icon: 'mdi-shield-account', childs: [
					{ key: 'users', icon: 'mdi-account-circle', to: '/access/user', },
					// { key: 'groups', icon: 'mdi-account-group', to: '/access/group', },
					{ key: 'roles', icon: 'mdi-account-tie', to: '/access/role', },
					{ key: 'permissions', icon: 'mdi-key-variant', to: '/access/permission', },
				] },
				{ key: 'database', icon: 'mdi-database', childs: [
					{ key: 'users', icon: 'mdi-account-circle', to: '/access/user', },
				] },
				{ key: 'endpoints', icon: 'mdi-api', childs: [
					{ key: 'users', icon: 'mdi-account-circle', to: '/access/user', },
				] },
				{ key: 'medias', icon: 'mdi-folder-multiple-image', to: '/medias', },
			];
		},

		appWidth() {
			return this.mode === 'apps' ? this.baseWidth : this.miniWidth;
		},

		width() {
			return this.mode !== 'mini' ? this.baseWidth : this.miniWidth;
		},

		hasLinks() {
			return Array.isArray(this.sections[0].childs);
		},

		showSubPanel() {
			return this.mode === 'links' && this.hasLinks;
		},

		mini() {
			return this.mode === 'mini';
		}
	},

	data() {
		return {
			user: new UserModel({
				firstName: 'Jane',
				lastName: 'Smith',
				role: 'Member',
			}),
			selectedLinkIdx: 0,
			sections: [],
			deepness: 0,
			baseWidth: 300,
			miniWidth: 56,
			hovering: false,
			searching: false,
			forceOpen: false,
			forceSearch: false,
			pinned: true,
			query: null,
			filteredItems: null,
			signOutDialog: { visible: false },
			bookmarks: [],
		}
	},

	watch: {

		selectedLinkIdx() {
			this.resetSections();
		},

		query(query = '') {
			clearTimeout(searchTimeout);
			searchTimeout = setTimeout(() => this.search(query), 500);
		}
	}
}
</script>

<style type="scss" scoped>
.v-navigation-drawer ::v-deep.v-navigation-drawer__content {
	display: flex;
	flex-direction: column;
}
.search-input ::v-deep .v-input__icon--prepend-inner {
	position: relative;
	left: -4px;
}
.v-application .v-item--active.v-list-item--active:not(:hover):before {
	background-color: transparent;
}
</style>

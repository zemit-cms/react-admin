module.exports = {
	lintOnSave: false,
	transpileDependencies: [
		"vuetify"
	],
	configureWebpack: {
		resolve: {
			symlinks: false
		}
	}
}

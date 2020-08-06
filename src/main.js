import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import VueRouter from "vue-router"
import VueI18n from 'vue-i18n'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import Component, { routes } from './routes'
import './utils'
import './index.scss'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.use(VueI18n)

const vuetify = new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#43aa8b',
				secondary: '#577590',
				error: '#f94144',
				warning: '#f9c74f',
				success: '#90be6d',
			},
			dark: {
				primary: '#43aa8b',
				secondary: '#577590',
				error: '#f94144',
				warning: '#f9c74f',
				success: '#90be6d',
			},
		}
	}
})

//f94144
//f3722c
//f8961e
//f9c74f
//90be6d
//43aa8b
//577590

const router = new VueRouter({
	mode: 'history',
	routes,
})

const i18n = new VueI18n({
	locale: 'en',
	fallbackLocale: 'en',
	messages: { en, fr }
})

new Vue({
	vuetify,
	router,
	i18n,
	render: h => h(Component)
}).$mount('#app')

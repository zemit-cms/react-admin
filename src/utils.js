import Vue from 'vue';
import Shortcuts from './utils/Shortcuts';

const $shortcuts = {};
$shortcuts.install = function (Vue) {
	Vue.prototype.$shortcuts = new Shortcuts();
};

Vue.use($shortcuts);

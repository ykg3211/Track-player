import Vue from 'vue';
import Router from 'vue-router';
import openlayers from '@/view/openlayers.vue';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '*',
			redirect: '/openlayers'
		},
		{
			path: '/',
			name: 'openlayers',
			component: openlayers
		}
	]
});

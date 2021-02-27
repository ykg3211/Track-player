import Vue from 'vue';
import Router from 'vue-router';
import index from '@/view/index.vue';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '*',
			redirect: '/'
		},
		{
			path: '/',
			name: 'index',
			component: index
		}
	]
});

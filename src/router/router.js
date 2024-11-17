import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/HelloWorld.vue';
import AboutVue from '../components/AboutVue.vue';

const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/about', component: AboutVue, name: 'About' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

import Vue from 'vue';
import Router from 'vue-router';
import KeyManager from './components/key-manager.vue';
import UserManager from './components/user-manager.vue';
import RoleManager from './components/role-manager.vue';
import HealthCheck from './components/health.vue';
import Configuration from './components/config.vue';
import LeaseManager from './components/lease-manager.vue';
import WatcherManager from './components/watcher-manager.vue';
import About from './components/about.vue';
import { isConfiguredGuard } from './guards/guards';


Vue.use(Router);

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.process && window.process.type === 'renderer';

export default new Router({
    // Use hash mode for Electron compatibility with app:// protocol
    mode: isElectron ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Configuration,
        },
        {
            path: '/keys',
            name: 'keys',
            component: KeyManager,
            beforeEnter: isConfiguredGuard,
        },
        {
            path: '/users',
            name: 'users',
            component: UserManager,
            beforeEnter: isConfiguredGuard,
        },
        {
            path: '/configure',
            name: 'config',
            component: Configuration,
        },
        {
            path: '/leases',
            name: 'leases',
            component: LeaseManager,
            beforeEnter: isConfiguredGuard,
        },
        {
            path: '/cluster',
            name: 'cluster',
            component: HealthCheck,
            beforeEnter: isConfiguredGuard,
        },
        {
            path: '/watchers',
            name: 'watchers',
            component: WatcherManager,
            beforeEnter: isConfiguredGuard,
        },
        {
            path: '/roles',
            name: 'roles',
            component: RoleManager,
            beforeEnter: isConfiguredGuard,
        },
        {
            path: '/about',
            name: 'about',
            component: About,
        },
    ],
});

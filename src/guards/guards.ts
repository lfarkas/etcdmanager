import store from '@/store';
import { Route } from 'vue-router';
import Vue from 'vue';

// @ts-expect-error -- untyped
export function isConfiguredGuard(to: Route, from: Route, next: any) {
    let cfg = null;
    try {
        // @ts-expect-error -- untyped
        const configStr = Vue.ls.get('config');
        if (configStr) {
            cfg = JSON.parse(configStr);
        }
    } catch (e) {
        // Invalid JSON in localStorage, redirect to configure
        // eslint-disable-next-line no-console
        console.error('Failed to parse config from localStorage:', e);
    }

    if (!cfg || !cfg.etcd || !cfg.etcd.hosts || !cfg.etcd.port) {
        store.commit('message', {
            text: 'Your ETCD config is incomplete, please update it!',
            show: true,
        });
        return next({ path: '/configure' });
    }
    next();
}

import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import store from '@/store';
import { GenericObject } from './../../types/index';
import { omit } from 'lodash-es';
import { ipcRenderer } from 'electron';

export class ConfigService {
    constructor(private localStorageService: LocalStorageService) {}

    public hasConfig() {
        return this.getConfig() !== null;
    }

    public getConfig() {
        return this.localStorageService.get('config');
    }

    public setConfig(data: GenericObject): ConfigService {
        this.localStorageService.set('config', data as JSON);
        return this;
    }

    public getProfile(name: string): GenericObject | null {
        const cnf = this.getConfig();
        if (!cnf || !cnf.profiles || !Array.isArray(cnf.profiles)) {
            return null;
        }
        return cnf.profiles.find((c: any) => c.config.name === name) || null;
    }

    public getProfileNames() {
        const cfg = this.getConfig();

        if (cfg && cfg.profiles) {
            return cfg.profiles.map((conf: any) => conf.config.name);
        }

        return [];
    }

    public getProfiles() {
        const cfg = this.getConfig();

        if (cfg && cfg.profiles) {
            return cfg.profiles;
        }

        return [];
    }

    public loadProfile(profile: string): ConfigService {
        const oldCfg = this.getProfile(profile);
        if (oldCfg) {
            this.replaceConfigState(oldCfg);
        } else {
            console.warn(`Profile "${profile}" not found`);
        }
        return this;
    }

    public removeProfile(profile: string): ConfigService {
        const cfg = this.getConfig();

        if (cfg && cfg.profiles) {
            cfg.profiles = cfg.profiles.filter(
                (conf: any) => conf.config.name !== profile
            );
            this.setConfig(cfg);
        }

        const defaultProfile = this.getProfile('default');
        if (defaultProfile) {
            this.replaceConfigState(defaultProfile);
        }

        return this;
    }

    public async replaceConfigState(config: GenericObject) {
        if (!config) {
            return true;
        }

        store.commit('config', config.config);
        store.commit('users', config.users);
        store.commit('etcdConfig', config.etcd);
        store.commit('watcherConfig', config.watchers);
        store.commit('separator', config.separator || '.');
        store.dispatch('locale', config.config.language);
        if (config.etcdAuth) {
            store.commit('etcdAuthConfig', config.etcdAuth);
        }

        if (config.credentials && config.credentials.rootCertificate) {
            // Handle various Buffer serialization formats
            const toBuffer = (data: any): Buffer => {
                if (Buffer.isBuffer(data)) {
                    return data;
                }
                if (typeof data === 'string') {
                    return Buffer.from(data);
                }
                if (Array.isArray(data)) {
                    return Buffer.from(data);
                }
                if (data && data.type === 'Buffer' && Array.isArray(data.data)) {
                    return Buffer.from(data.data);
                }
                // Handle object with numeric keys (like {0: 45, 1: 45, 2: 45, ...})
                if (data && typeof data === 'object') {
                    const keys = Object.keys(data);
                    if (keys.length > 0 && keys.every(k => !isNaN(Number(k)))) {
                        const arr = keys.sort((a, b) => Number(a) - Number(b)).map(k => data[k]);
                        return Buffer.from(arr);
                    }
                }
                console.error('[config.service] Unknown buffer format:', data);
                throw new Error('Unknown buffer format');
            };

            // Extract PEM portion from data that may contain text header
            const extractPem = (buf: Buffer, type: 'CERTIFICATE' | 'PRIVATE KEY'): Buffer => {
                const str = buf.toString('utf8');
                const beginMarkers = type === 'CERTIFICATE'
                    ? ['-----BEGIN CERTIFICATE-----']
                    : ['-----BEGIN PRIVATE KEY-----', '-----BEGIN RSA PRIVATE KEY-----', '-----BEGIN EC PRIVATE KEY-----'];
                const endMarkers = type === 'CERTIFICATE'
                    ? ['-----END CERTIFICATE-----']
                    : ['-----END PRIVATE KEY-----', '-----END RSA PRIVATE KEY-----', '-----END EC PRIVATE KEY-----'];

                for (let i = 0; i < beginMarkers.length; i += 1) {
                    const beginMarker = beginMarkers[i];
                    const endMarker = endMarkers[i];
                    const beginIdx = str.indexOf(beginMarker);
                    if (beginIdx !== -1) {
                        const endIdx = str.indexOf(endMarker, beginIdx);
                        if (endIdx !== -1) {
                            return Buffer.from(str.substring(beginIdx, endIdx + endMarker.length), 'utf8');
                        }
                    }
                }
                return buf;
            };

            config.credentials.rootCertificate = extractPem(
                toBuffer(config.credentials.rootCertificate),
                'CERTIFICATE'
            );
            if (config.credentials.privateKey && config.credentials.certChain) {
                config.credentials.privateKey = extractPem(
                    toBuffer(config.credentials.privateKey),
                    'PRIVATE KEY'
                );
                config.credentials.certChain = extractPem(
                    toBuffer(config.credentials.certChain),
                    'CERTIFICATE'
                );
            }
        }
        if (config.etcd.hosts) {
            const auth = config.etcdAuth ? { auth: config.etcdAuth } : {};
            store.commit('etcdConnect', {
                ...omit(config.etcd, 'port'),
                ...auth,
                ...{ hosts: `${config.etcd.hosts}:${config.etcd.port}` },
                ...{ credentials: config.credentials },
            });
        }
        const authService = new AuthService();
        let isRoot = true;
        if (authService.isAuthenticated()) {
            isRoot = await authService.isRoot();
        }
        store.commit('limited', isRoot);
        store.commit('updateCurrentProfile', config);
        ipcRenderer.send('update-menu', undefined, { manage: isRoot });

        return true;
    }
}

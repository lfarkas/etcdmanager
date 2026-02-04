import { AuthService } from './auth.service';
import store from '@/store';
import {
    DataService,
    RevisionListType,
    GenericObject,
} from './../../types/index';
import { MultiRangeBuilder, Etcd3, DeleteBuilder, Role } from 'etcd3';
import EtcdService from './etcd.service';

export default class KeyService extends EtcdService implements DataService {

    private authService: AuthService;

    constructor(client?: Etcd3) {
        super(client);
        this.authService = new AuthService();

    }

    public async getRevisions(key: string): Promise<RevisionListType> {
        const result: RevisionListType = {
            revisions: [],
            watcher: null as any,
        };

        const current = await this.client.watch().key(key);

        current.request.start_revision = 1;

        result.watcher = await current.create();
        result.watcher.on('data', (res) => {
            res.events.forEach((event) => {
                result.revisions.unshift({
                    key: event.kv.key.toString(),
                    value: event.kv.value.toString(),
                    version: event.kv.version,
                    createRevision: event.kv.create_revision,
                    modRevision: event.kv.mod_revision,
                    type: event.type,
                });
            });
        });

        return result;
    }

    public loadKey(key: string): Promise<any> {
        return this.client.get(key).string();
    }

    private async mkAuthQueries(isPut: boolean = true): Promise<Promise<{ [key: string]: string; }>[]> {
        const auth = store.state.etcdAuth.username;
        const roles = await this.client.user(auth).roles();

        // Fetch all permissions in parallel to avoid N+1 queries
        const permissionsPromises = roles.map((role: Role) => role.permissions());
        const allPermissions = await Promise.all(permissionsPromises);

        const queries: Promise<{ [key: string]: string; }>[] = [];
        for (const permissions of allPermissions) {
            for (const permission of permissions) {
                let query: MultiRangeBuilder | DeleteBuilder;
                if (isPut) {
                    query = this.client.getAll();
                    // Use lowercase for consistent permission checking
                    if (permission.permission.toLowerCase().includes('read')) {
                        query.inRange(permission.range);
                        queries.push((query as MultiRangeBuilder).strings());
                    }
                } else {
                    query = this.client.delete();
                    // Use lowercase for consistent permission checking
                    if (permission.permission.toLowerCase().includes('write')) {
                        query.inRange(permission.range);
                        // @ts-ignore
                        queries.push(query);
                    }
                }
            }
        }

        return queries;
    }

    public async loadAllKeys(prefix?: string): Promise<any> {

        let queries: Promise<{ [key: string]: string; }>[] = [];
        let query: MultiRangeBuilder = this.client.getAll();

        if (!this.authService.isAuthenticated() || await this.authService.isRoot()) {

            if (prefix) {
                query = query.prefix(prefix);
            }

            queries.push(query.strings());

        } else {
            queries = await this.mkAuthQueries();
        }

        let res: GenericObject = {};

        const results = await Promise.all(queries);

        results.forEach((result: any) => {
            res = { ...res, ...result };
        });

        return Promise.resolve(res);
    }

    public async upsert(
        key: string,
        value: string,
        ttl: string,
        isCreate: boolean = true
    ): Promise<any> {
        if (isCreate) {
            const  ttlNum = parseInt(ttl, 10);
            const clientOrLease = ttlNum ? this.client.lease(ttlNum) : this.client;

            if (ttlNum) {
                const  tid = setTimeout(() => {
                    clientOrLease.revoke().catch((err: Error) => {
                        console.error('Failed to revoke lease:', err);
                    });
                    clearTimeout(tid);
                }, ttlNum * 1000);
            }

            return this.client
                .if(key, 'Create', '==', 0)
                .then(clientOrLease.put(key).value(value))
                .else(this.client.get(key))
                .commit();
        }
        return this.client.put(key)
        .ignoreLease()
        .value(value);
    }

    public async purge(): Promise<any> {

        const builder = this.client.delete();
        let queries: Promise<{ [key: string]: string; }>[] = [];

        if (!this.authService.isAuthenticated() || await this.authService.isRoot()) {
            queries.push(builder.all());
        } else {
            queries = await this.mkAuthQueries(false);
        }

        return Promise.all(queries);

    }

    private mkKeySet(keys: GenericObject[] | string[]): Set<string> {
        let keySet = new Set<string>();
        if (typeof keys[0] !== 'string') {
            (keys as GenericObject[]).forEach((key: GenericObject) => {
                keySet.add(key.original.key);
            });
        } else {
            keySet = new Set(keys as string[]);
        }
        return keySet;
    }

    public touch(keys: GenericObject[] | string[]): Promise<any> {
        const promises: Promise<any>[] = [];

        this.mkKeySet(keys).forEach((key) => {
            promises.push(this.client.put(key).touch(key));
        });

        return Promise.all(promises);
    }

    public remove(keys: GenericObject[] | string[]): Promise<any> {
        const promises: Promise<any>[] = [];

        this.mkKeySet(keys).forEach((key: string) => {
            promises.push(
                this.client
                    .delete()
                    .key(key)
                    .exec()
            );
        });

        return Promise.all(promises);
    }

    public stats() {
        return this.client.cluster.memberList();
    }
}

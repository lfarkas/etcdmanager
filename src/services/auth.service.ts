import { Etcd3, Role } from 'etcd3';
import store from '@/store';

export class AuthService {
    client: Etcd3;

    constructor(client?: Etcd3) {
        this.client = client || this.updateClient();
    }

    public updateClient() {
        return store.state.connection.getClient();
    }

    public getUser() {
        return store.state.etcdAuth.username || '';
    }

    public isAuthenticated() {
        return this.getUser() !== '';
    }

    public async isRoot() {
        return Promise.resolve((
            store.state.etcdAuth.username === 'root' ||
            (await this.hasRole('root'))
        ));
    }

    public async hasRole(roleName: string): Promise<boolean> {
        if (!this.isAuthenticated()) {
            // Unauthenticated users should not have any roles - return false for security
            return false;
        }
        if (!this.client) {
            this.client = this.updateClient();
        }

        let roles: Role[] = [];

        try {
            roles = await this.client.user(this.getUser()).roles();
        } catch (e) {
            // Log the error for debugging purposes
            console.error(`Failed to fetch roles for user "${this.getUser()}":`, e);
            // Return false to indicate the user doesn't have the role (safe default)
            return false;
        }

        for (const role of roles) {
            if (role.name === roleName) {
                return true;
            }
        }

        return false;
    }
}

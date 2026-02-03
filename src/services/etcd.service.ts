import {
    Etcd3,
    IOptions,
} from 'etcd3';

export default class EtcdService {
    protected client: any = null;

    constructor(client?: Etcd3) {
        if (client) {
            this.client = client;
        }
    }

    public getClient(): Etcd3 {
        return this.client;
    }

    public async isConnectionAvailable() {
        // In etcd3 1.x, use maintenance.status() to check connection
        try {
            await this.client.maintenance.status();
            return true;
        } catch (e) {
            return false;
        }
    }

    public init(options?: IOptions): EtcdService | string {
        if (this.client) {
            this.client.close();
        }
        try {
            this.client = new Etcd3(options);
        } catch (e) {
            throw e;
        }

        return this;
    }



}

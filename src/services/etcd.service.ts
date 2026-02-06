import {
    Etcd3,
    IOptions,
} from 'etcd3';

export default class EtcdService {
    protected client: Etcd3 | null = null;

    constructor(client?: Etcd3) {
        if (client) {
            this.client = client;
        }
    }

    public getClient(): Etcd3 | null {
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

    public init(options?: IOptions): EtcdService {
        if (this.client) {
            this.client.close();
        }
        // Increase gRPC message size limits to handle large datasets
        // Default is 4MB which causes RESOURCE_EXHAUSTED errors (#123, #80, #78)
        const grpcOptions = {
            'grpc.max_receive_message_length': 100 * 1024 * 1024, // 100MB
            'grpc.max_send_message_length': 100 * 1024 * 1024,    // 100MB
        };
        const mergedOptions: IOptions = {
            hosts: options?.hosts || 'localhost:2379',
            ...options,
            grpcOptions: { ...options?.grpcOptions, ...grpcOptions },
        };
        this.client = new Etcd3(mergedOptions);

        return this;
    }



}

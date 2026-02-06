import { GenericObject } from './../../types/index';
import {
    Etcd3, ILeaseTimeToLiveResponse, ILeaseRevokeResponse,
} from 'etcd3';
import EtcdService from './etcd.service';

export default class LeaseService extends EtcdService {

    constructor(client?: Etcd3) {
        super(client);
    }

    public async getLeases(): Promise<GenericObject[]> {
        const res = await this.client.leaseClient.leaseLeases();
        return res.leases.map((lease: any) => {
            return { ID: lease.ID }
        });
    }

    public async loadLease(leaseId: string): Promise<ILeaseTimeToLiveResponse> {
        return this.client.leaseClient.leaseTimeToLive({
            ID: leaseId,
            keys: true,
        });
    }

    public async purge(): Promise<ILeaseRevokeResponse[]> {
        const leases = await this.getLeases();
        const promises: Promise<ILeaseRevokeResponse>[] = [];
        leases.forEach((lease) => {
            promises.push(this.client.leaseClient.leaseRevoke({
                ID: lease.ID,
            }));
        });
        return Promise.all(promises);
    }


    public remove(leaseIds: (string | number)[]): Promise<ILeaseRevokeResponse[]> {
        const promises: Promise<ILeaseRevokeResponse>[] = [];
        leaseIds.forEach((leaseId) => {
            promises.push(this.client.leaseClient.leaseRevoke({
                ID: leaseId,
            }));
        });
        return Promise.all(promises);
    }

}

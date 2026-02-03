import { GenericObject } from './../../types/index';
export class LocalStorageService {
    private ls: any;

    constructor(ls: any) {
        this.ls = ls;
    }

    public get(key: string): GenericObject | null {
        try {
            const value = this.ls.get(key);
            if (value === null || value === undefined) {
                return null;
            }
            return JSON.parse(value);
        } catch (e) {
            console.error(`Failed to parse localStorage key "${key}":`, e);
            return null;
        }
    }

    public getRaw(key: string): any {
        return this.ls.get(key);
    }

    public set(key: string, data: any): LocalStorageService {
        this.ls.set(key, JSON.stringify(data));
        return this;
    }

}

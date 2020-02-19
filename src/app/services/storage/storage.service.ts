import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {  Subject, from} from 'rxjs';
import { map } from 'rxjs/operators';
import { isObject, isString, toString } from 'lodash';
@Injectable({
    providedIn: 'root'
})
export class StorageService {

    public onClear$: Subject<void> = new Subject<void>();

    constructor(private storage: Storage) { }

    public get(key:any) {
        return from(this.storage.get(key));
    }

    public getObject(key) {
        return from(this.storage.get(key)).pipe(map(result => JSON.parse(result || '{}')));
    }

    public set(key:any, value:any) {
        if (isObject(value)) {
            value = JSON.stringify(value);
        }

        if (value && !isString(value)) {
            value = toString(value);
        }

        return from(this.storage.set(key, value));
    }

    public clear() {
        from(this.storage.clear());
        return this.onClear$.next();
    }
}

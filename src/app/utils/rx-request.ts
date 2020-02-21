import { Observable } from 'rxjs';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { environment} from "@environment/environment"
/** Based on @waldojeffers/rx-request. */
export class RxRequest {
    private req: AxiosInstance;
    public get;
    public post;
    public put;
    private static _instance: RxRequest;
    constructor(options: any) {
        const headers = {
            ...options.headers,
            'Content-Type': 'application/json',
        };

        this.req = axios.create({
            ...options,
            headers
        });

        this.get = this.toObservable(this.req.get);
        this.post = this.toObservable(this.req.post);
        this.put = this.toObservable(this.req.put);
    }
    public static get Instance(): RxRequest {
        if (RxRequest._instance == null){
            this._instance = new RxRequest(environment.api);
        }

        return RxRequest._instance;
    }

    private toObservable(method: any): (url: string, options:AxiosRequestConfig) => Observable<any> {

        return (url: string, options: AxiosRequestConfig): Observable<any> => {
            return new Observable((observer) => {
                method(url, options)
                    .then((res) => {
                        if (res.status < 200 || res.status >= 300) {
                            observer.error({
                                ...res.data,
                            });
                        } else {
                            observer.next(res.data);
                            observer.complete();
                        }
                    })
                    .catch((err) => {
                        observer.error(err);
                        observer.complete();
                    });
            });
        };
    }
}

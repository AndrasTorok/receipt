import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../app/app.config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export abstract class ServiceBase<T> {
    protected _requestOptions: RequestOptions;
    protected _url: string;

    constructor(protected _http: Http, protected _config: AppConfig = null, protected _serviceUrl: string, protected _doLog: boolean = false) {
        var host = this._config.getConfig('host'),
            origin = this._config.getConfig('origin'),
            headers = new Headers({ 'Access-Control-Allow-Origin': origin });

        this._requestOptions = new RequestOptions({ headers: headers });
        this._url = `${host}/api/${this._serviceUrl}`;
    }

    getAll(): Observable<T[]> {
        return this._http.get(this._url)
            .map((response: Response) => <T>response.json())
            .do(data => {
                if (this._doLog) console.log(`All ${JSON.stringify(data)}`);
            })
            .catch(this.handleError);
    }

    getById(id: string): Observable<T> {
        return this._http.get(`${this._url}/${id}`)
            .map((response: Response) => <T>response.json())
            .do(data => {
                if (this._doLog) console.log(`All ${JSON.stringify(data)}`);
            })
            .catch(this.handleError);
    }

    put(item: T): Observable<T> {
        return this._http.put(`${this._url}`, item)
            .map((response: Response) => <T>response.json())
            .do(data => {
                if (this._doLog) console.log(`All ${JSON.stringify(data)}`);
            })
            .catch(this.handleError);
    }

    post(item: T): Observable<T> {
        return this._http.post(`${this._url}`, item)
            .map((response: Response) => <T>response.json())
            .do(data => {
                if (this._doLog) console.log(`All ${JSON.stringify(data)}`);
            })
            .catch(this.handleError);
    }

    protected handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    fetchEntityAndUnsubscribe(callback: (entities: T[]) => void, sort: (first: T, second: T) => number = null): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            var subscription = this.getAll().subscribe(entities => {
                if (sort) entities = entities.sort(sort);
                callback(entities);
                subscription.unsubscribe();
                resolve();
            }, err => {
                console.log(err);
            });
        });
    }
}
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AppConfig } from '../app/app.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { MessageService } from '../messages/message.service';
import { Message } from '../messages/message.model';

@Injectable()
export abstract class ServiceBase<T> {
    protected _requestOptions: RequestOptions;
    protected _url: string;

    constructor(protected _http: Http, private _messageService: MessageService, protected _config: AppConfig = null, protected _serviceUrl: string, protected _doLog: boolean = false) {
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

    delete(id: string): Observable<boolean> {
        return this._http.delete(`${this._url}/${id}`)
            .map((response: Response) => response.ok)
            .do(data => {
                if (this._doLog) console.log(`All ${JSON.stringify(data)}`);
            })
            .catch(this.handleError);
    }

    protected getAllFor(segment: string, id: string): Observable<T[]> {
        let url = `${this._url}/getAllFor${segment}/${id}`;

        return this._http.get(url)
            .map((response: Response) => <T>response.json())
            .do(data => {
                if (this._doLog) console.log(`All ${JSON.stringify(data)}`);
            })
            .catch(this.handleError);
    }

    protected handleError(error: Response) {
        let message;

        if(error.status == 403) {
            message = `${error.json().Message} ${error.statusText}`;
        } else {
            message = error.json().error;
        }

        console.error(error);
        return Observable.throw(message || 'Server error');
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

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';
import { Cycle, ICycle } from './cycle.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class CycleService extends ServiceBase<Cycle> {    

    constructor(http : Http, config: AppConfig) {
        super(http, config, 'cycle');                   
    }    

    getAllForDiagnosticId(diagnosticId: string) {
        return this._http.get(`${this._url}/getAllForDiagnosticId/${diagnosticId}`)
        .map((response: Response) => <ICycle>response.json())
        .do(data => {
            if (this._doLog) console.log(`All ${JSON.stringify(data)}`);
        })
        .catch(this.handleError);
    }
}
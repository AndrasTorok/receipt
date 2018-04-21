import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';
import { Cycle, ICycle } from './cycle.model';
import { CycleItem, ICycleItem } from './cycle-item.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { MessageService } from '../messages/message.service';

@Injectable()
export class CycleService extends ServiceBase<Cycle> {

    constructor(http: Http, messageService: MessageService, config: AppConfig) {
        super(http, messageService, config, 'cycle');
    }

    getAllForDiagnosticId(diagnosticId: string): Observable<Cycle[]> {
        return super.getAllFor('DiagnosticId', diagnosticId);
    }

    cycleGraph(cycle: Cycle): Observable<Cycle> {
        return this._http.post(`${this._url}/cycleGraph`, cycle)
            .map((response: Response) => <CycleItem[]>response.json())
            .do(data => {
                if (this._doLog) console.log(`All ${JSON.stringify(data)}`);
            })
            .catch(this.handleError);
    }
}
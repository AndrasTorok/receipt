import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';
import { Cycle, ICycle } from './cycle.model';

@Injectable()
export class CycleService extends ServiceBase<Cycle> {    

    constructor(http : Http, config: AppConfig) {
        super(http, config, 'cycle');                   
    }    

    getAllForDiagnosticId(diagnosticId: string) : Observable<Cycle[]> {
        return super.getAllFor('DiagnosticId', diagnosticId);        
    }
}
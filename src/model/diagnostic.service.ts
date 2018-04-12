import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';
import { Diagnostic } from './diagnostic.model';

@Injectable()
export class DiagnosticService extends ServiceBase<Diagnostic> {    

    constructor(http : Http, config: AppConfig) {
        super(http, config, 'diagnostic');                   
    }    

    getAllForPatientId(patientId: string) : Observable<Diagnostic[]> {
        return super.getAllFor('PatientId', patientId);        
    }
}
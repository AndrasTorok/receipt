import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';
import { Diagnostic } from './diagnostic.model';
import { MessageService } from '../messages/message.service';

@Injectable()
export class DiagnosticService extends ServiceBase<Diagnostic> {

    constructor(http: Http, messageService: MessageService, config: AppConfig) {
        super(http, messageService, config, 'diagnostic');
    }

    getAllForPatientId(patientId: string): Observable<Diagnostic[]> {
        return super.getAllFor('PatientId', patientId);
    }
}
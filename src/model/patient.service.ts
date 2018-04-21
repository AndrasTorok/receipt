import { Injectable } from '@angular/core';
import { Patient } from './patient.model';
import { Http } from '@angular/http';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';
import { MessageService } from '../messages/message.service';

@Injectable()
export class PatientService extends ServiceBase<Patient> {

    constructor(http: Http, messageService: MessageService, config: AppConfig) {
        super(http, messageService, config, 'patient');
    }
}
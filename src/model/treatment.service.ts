import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ServiceBase } from './servicesBase';
import { AppConfig } from '../app/app.config';
import { Treatment, ITreatment } from './treatment.model';
import { MessageService } from '../messages/message.service';

@Injectable()
export class TreatmentService extends ServiceBase<Treatment> {

    constructor(http: Http, messageService: MessageService, config: AppConfig) {
        super(http, messageService, config, 'treatment');
    }
}